package org.maxq.apigatewayservice.security;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.Test;
import org.maxq.apigatewayservice.config.AuthorizationServiceLoadBalancerConfig;
import org.maxq.apigatewayservice.security.config.WebSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;

@SpringBootTest(
    classes = {AuthorizationServiceLoadBalancerConfig.class, WebSecurityConfig.class},
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8081)
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
class SecurityFilterChainTests {

  @LocalServerPort
  private int port;
  @Autowired
  private WebTestClient webTestClient;

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
  @WithMockUser(username = "test", roles = {"OPERATOR"})
  void shouldPassAuthenticatedEndpoint_when_isAuthenticated() {
    // Given
    stubFor(WireMock.get("/login/me")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient
        .get()
        .uri("/api/auth/login/me")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();
  }

  @Test
  @WithMockUser(username = "test", roles = {"OPERATOR"})
  void shouldNotAllowToAuthenticatedEndpoint() {
    // Given
    stubFor(WireMock.get("/users")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient
        .get()
        .uri("/api/auth/users")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isForbidden()
        .expectBody().jsonPath("$.message").isEqualTo("Forbidden: You don't have permission to access this resource");
  }

  @Test
  @WithMockUser(username = "test", roles = {"ADMIN"})
  void shouldAllowToAuthenticatedEndpoint_when_isAdmin() {
    // Given
    stubFor(WireMock.get("/users")
        .willReturn(WireMock.ok()));

    // When + Then
    webTestClient
        .get()
        .uri("/api/auth/users")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();
  }
}
