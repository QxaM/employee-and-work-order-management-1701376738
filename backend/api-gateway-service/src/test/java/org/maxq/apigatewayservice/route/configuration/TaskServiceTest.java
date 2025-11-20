package org.maxq.apigatewayservice.route.configuration;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.apigatewayservice.config.ServiceLoadBalancerConfig;
import org.maxq.apigatewayservice.utils.RequestsUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
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
@WireMockTest(httpPort = 8083)
@TestPropertySource(
    properties = {
        "eureka.client.enabled=false",
        "test.loadbalancer=task"
    }
)
class TaskServiceTest {

  @LocalServerPort
  private int port;
  @Autowired
  private WebTestClient webTestClient;

  protected static Stream<HttpMethod> allowedMethods() {
    return RequestsUtils.buildAllowedMethods(
        HttpMethod.GET, HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE
    );
  }

  protected static Stream<HttpMethod> disallowedMethods() {
    return RequestsUtils.buildDisallowedMethods(allowedMethods().toArray(HttpMethod[]::new));
  }

  @BeforeEach
  void setUp() {
    String baseUri = "http://localhost:" + port;
    webTestClient =
        WebTestClient.bindToServer()
            .responseTimeout(Duration.ofSeconds(10))
            .baseUrl(baseUri)
            .build();

    allowedMethods().forEach(method ->
        stubFor(WireMock.request(method.name(), WireMock.urlEqualTo("/test"))
            .willReturn(WireMock.ok())));
  }

  @ParameterizedTest
  @MethodSource("allowedMethods")
  void shouldRouteToTaskService(HttpMethod method) {
    // Given
    String taskUri = "/api/task";

    // When + Then
    webTestClient.method(method)
        .uri(taskUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();
  }

  @ParameterizedTest
  @MethodSource("disallowedMethods")
  void shouldNotRouteToDisallowedMethods(HttpMethod method) {
    // Given
    String taskUri = "/api/task";

    // When + Then
    webTestClient.method(method)
        .uri(taskUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isNotFound();
  }

  @Test
  void shouldNotRouteWithoutContentType() {
    // Given
    String taskUri = "/api/task";
    HttpMethod method = allowedMethods().findFirst().orElse(HttpMethod.GET);

    // When + Then
    webTestClient.method(method)
        .uri(taskUri + "/test")
        .exchange()
        .expectStatus().isNotFound();
  }

  @Test
  void shouldNotRouteWithInvalidContentType() {
    // Given
    String taskUri = "/api/task";
    HttpMethod method = allowedMethods().findFirst().orElse(HttpMethod.GET);
    MediaType invalidContentType = MediaType.TEXT_PLAIN;

    // When + Then
    webTestClient.method(method)
        .uri(taskUri + "/test")
        .contentType(invalidContentType)
        .exchange()
        .expectStatus().isNotFound();
  }
}
