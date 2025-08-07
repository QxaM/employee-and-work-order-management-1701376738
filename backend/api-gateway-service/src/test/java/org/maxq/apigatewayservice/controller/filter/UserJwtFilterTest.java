package org.maxq.apigatewayservice.controller.filter;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.apigatewayservice.config.AuthorizationServiceLoadBalancerConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Duration;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;

@SpringBootTest(
    classes = {AuthorizationServiceLoadBalancerConfig.class},
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8081)
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
class UserJwtFilterTest {

  @LocalServerPort
  private int port;
  @Autowired
  private WebTestClient webTestClient;

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
  }

  @Test
  @WithMockUser(username = "test", roles = {"OPERATOR"})
  void shouldAddHeadersWhenTokenExists() {
    // Given
    String authUri = "/api/auth";

    // When
    webTestClient.get()
        .uri(authUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(WireMock.getRequestedFor(WireMock.urlEqualTo("/test"))
        .withHeader("X-User", WireMock.equalTo("test"))
        .withHeader("X-User-Roles", WireMock.equalTo("ROLE_OPERATOR")));
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
