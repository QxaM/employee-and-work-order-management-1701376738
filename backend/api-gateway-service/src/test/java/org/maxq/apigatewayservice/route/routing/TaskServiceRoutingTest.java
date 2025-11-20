package org.maxq.apigatewayservice.route.routing;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.apigatewayservice.config.ServiceLoadBalancerConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Duration;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;

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
class TaskServiceRoutingTest {

  @LocalServerPort
  private int port;
  @Autowired
  private WebTestClient webTestClient;

  @BeforeEach
  void setUp() {
    String baseUri = "http://localhost:" + port;
    webTestClient =
        WebTestClient.bindToServer()
            .responseTimeout(Duration.ofSeconds(10))
            .baseUrl(baseUri)
            .build();

    stubFor(WireMock.get("/test").willReturn(WireMock.ok()));
  }

  @Test
  void shouldCallDownstreamService() {
    // Given
    String taskUri = "/api/task";

    // When
    webTestClient.get()
        .uri(taskUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(1, WireMock.getRequestedFor(WireMock.urlEqualTo("/test")));
  }

  @Test
  void shouldAddXGatewayHeader() {
    // Given
    String taskUri = "/api/task";

    // When
    webTestClient.get()
        .uri(taskUri + "/test")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(1, WireMock.getRequestedFor(WireMock.urlEqualTo("/test"))
        .withHeader("X-Gateway", WireMock.equalTo("api-gateway-service")));
  }
}
