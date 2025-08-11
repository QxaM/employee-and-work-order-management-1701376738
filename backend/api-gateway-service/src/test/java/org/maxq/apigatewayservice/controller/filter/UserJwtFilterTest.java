package org.maxq.apigatewayservice.controller.filter;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.apigatewayservice.config.ServiceLoadBalancerConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static org.mockito.Mockito.when;

@SpringBootTest(
    classes = {ServiceLoadBalancerConfig.class},
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8081)
@TestPropertySource(properties = {
    "eureka.client.enabled=false",
    "test.loadbalancer=authorization"
})
class UserJwtFilterTest {

  String userEmail = "test@test.com";
  List<String> roles = List.of("ROLE_OPERATOR");
  Jwt jwt = Jwt.withTokenValue("test-token")
      .header("alg", "RS256")
      .subject(userEmail)
      .issuer("authorization-service")
      .claim("type", "access_token")
      .claim("roles", roles)
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();
  @LocalServerPort
  private int port;
  @Autowired
  private WebTestClient webTestClient;
  @MockitoBean
  private ReactiveJwtDecoder jwtDecoder;

  @BeforeEach
  void setUp() {
    String baseUri = "http://localhost:" + port;
    this.webTestClient =
        WebTestClient.bindToServer()
            .responseTimeout(Duration.ofSeconds(10))
            .baseUrl(baseUri)
            .build();

    stubFor(WireMock.get("/test")
        .willReturn(WireMock.ok()));
    when(jwtDecoder.decode("test-token")).thenReturn(Mono.just(jwt));
  }

  @Test
  void shouldAddHeadersWhenTokenExists() {
    // Given
    String authUri = "/api/auth";

    // When
    webTestClient.get()
        .uri(authUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(WireMock.getRequestedFor(WireMock.urlEqualTo("/test"))
        .withHeader("X-User", WireMock.equalTo(userEmail))
        .withHeader("X-User-Roles", WireMock.equalTo(String.join(",", roles))));
  }

  @Test
  void shouldNotAddHeaders_When_TokenDoesNotExist() {
    // Given
    String authUri = "/api/auth";

    // When
    webTestClient.get()
        .uri(authUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(WireMock.exactly(0), WireMock.getRequestedFor(WireMock.urlEqualTo("/test"))
        .withHeader("X-User", WireMock.equalTo("test"))
        .withHeader("X-User-Roles", WireMock.equalTo("ROLE_OPERATOR")));
  }
}
