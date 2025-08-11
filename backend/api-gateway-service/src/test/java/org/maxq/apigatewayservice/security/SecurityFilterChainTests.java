package org.maxq.apigatewayservice.security;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.apigatewayservice.config.ServiceLoadBalancerConfig;
import org.maxq.apigatewayservice.security.config.WebSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
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
import static org.mockito.Mockito.when;

@SpringBootTest(
    classes = {ServiceLoadBalancerConfig.class, WebSecurityConfig.class},
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8081)
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
class SecurityFilterChainTests {

  String userEmail = "test@test.com";
  List<String> roles = List.of("ROLE_ADMIN");
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

    when(jwtDecoder.decode("test-token")).thenReturn(Mono.just(jwt));
  }

  @Test
  void shouldAllowToRequestPublicEndpoint() {
    // Given
    stubFor(WireMock.post("/register")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient.post()
        .uri("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .exchange()
        .expectStatus().isOk();
  }

  @Test
  void shouldNotAllowToRequestAuthenticatedEndpoint() {
    // Given
    stubFor(WireMock.get("/login/me")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient.get()
        .uri("/api/auth/login/me")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isUnauthorized()
        .expectBody().jsonPath("$.message").isEqualTo("Unauthorized to access this resource, login please");
  }

  @Test
  void shouldPassAuthenticatedEndpoint_when_isAuthenticated() {
    // Given
    stubFor(WireMock.get("/login/me")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient
        .get()
        .uri("/api/auth/login/me")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
        .exchange()
        .expectStatus().isOk();
  }

  @Test
  void shouldNotAllowToAuthenticatedEndpoint() {
    // Given
    Jwt operatorJwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .subject(userEmail)
        .issuer("authorization-service")
        .claim("type", "access_token")
        .claim("roles", List.of("ROLE_OPERATOR"))
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();

    stubFor(WireMock.get("/users")
        .willReturn(WireMock.ok()));
    when(jwtDecoder.decode("test-token")).thenReturn(Mono.just(operatorJwt));

    // When + Then
    webTestClient
        .get()
        .uri("/api/auth/users")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
        .exchange()
        .expectStatus().isForbidden()
        .expectBody().jsonPath("$.message").isEqualTo("Forbidden: You don't have permission to access this resource");
  }

  @Test
  void shouldAllowToAuthenticatedEndpoint_when_isAdmin() {
    // Given
    stubFor(WireMock.get("/users")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient
        .get()
        .uri("/api/auth/users")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
        .exchange()
        .expectStatus().isOk();
  }
}
