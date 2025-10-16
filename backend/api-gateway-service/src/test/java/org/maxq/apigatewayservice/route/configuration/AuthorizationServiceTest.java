package org.maxq.apigatewayservice.route.configuration;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.apigatewayservice.config.ServiceLoadBalancerConfig;
import org.maxq.apigatewayservice.utils.RequestsUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Duration;
import java.util.stream.Stream;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;


@SpringBootTest(
    classes = {ServiceLoadBalancerConfig.class},
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8081)
@TestPropertySource(properties = {
    "eureka.client.enabled=false",
    "test.loadbalancer=authorization"
})
class AuthorizationServiceTest {

  @LocalServerPort
  private int port;
  @Autowired
  private WebTestClient webTestClient;

  protected static Stream<HttpMethod> allowedMethods() {
    return RequestsUtils.buildAllowedMethods(
        HttpMethod.GET, HttpMethod.POST, HttpMethod.PATCH
    );
  }

  protected static Stream<HttpMethod> disallowedMethods() {
    return RequestsUtils.buildDisallowedMethods(allowedMethods().toArray(HttpMethod[]::new));
  }

  @BeforeEach
  void setUp() {
    String baseUri = "http://localhost:" + port;
    this.webTestClient =
        WebTestClient.bindToServer()
            .responseTimeout(Duration.ofSeconds(10))
            .baseUrl(baseUri)
            .build();

    allowedMethods().forEach(method ->
        stubFor(WireMock.request(method.name(), WireMock.urlEqualTo("/test"))
            .willReturn(WireMock.ok()))
    );
  }

  @ParameterizedTest
  @MethodSource("allowedMethods")
  void shouldRouteToAuthorizationServiceHealthEndpoint(
      HttpMethod method) {
    // Given
    String authUri = "/api/auth";

    // When + Then
    webTestClient.method(method)
        .uri(authUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();
  }

  @ParameterizedTest
  @MethodSource("disallowedMethods")
  void shouldNotRouteDisallowedMethods(HttpMethod method) {
    // Given
    String authUri = "/api/auth";

    // When + Then
    webTestClient.method(method)
        .uri(authUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isNotFound();
  }

  @Test
  void shouldNotRouteWithoutContentType() {
    // Given
    String authUri = "/api/auth";
    HttpMethod method = allowedMethods().findFirst().orElse(HttpMethod.GET);

    // When + Then
    webTestClient.method(method)
        .uri(authUri + "/test")
        .exchange()
        .expectStatus().isNotFound();
  }

  @Test
  void shouldNotRouteWithInvalidContentType() {
    // Given
    String authUri = "/api/auth";
    HttpMethod method = allowedMethods().findFirst().orElse(HttpMethod.GET);
    String invalidContentType = MediaType.TEXT_PLAIN_VALUE;

    // When + Then
    webTestClient.method(method)
        .uri(authUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, invalidContentType)
        .exchange()
        .expectStatus().isNotFound();
  }
}
