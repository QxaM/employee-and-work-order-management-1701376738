package org.maxq.apigatewayservice.route.routing;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.apigatewayservice.config.ServiceLoadBalancerConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
@WireMockTest(httpPort = 8082)
@TestPropertySource(properties = {
    "eureka.client.enabled=false",
    "test.loadbalancer=profile"
})
class ProfileServiceFileUploadRoutingTest {

  private static final String PROFILE_URL = "/api/profile";
  private static final String UPLOAD_URL = "/test";
  private static final String BOUNDARY = "CustomBoundaryValue";

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

    stubFor(WireMock.request(HttpMethod.POST.name(), WireMock.urlEqualTo(UPLOAD_URL))
        .willReturn(WireMock.ok()));
  }

  @Test
  void shouldCallDownstreamService() {
    // Given

    // When
    webTestClient.post()
        .uri(PROFILE_URL + UPLOAD_URL)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE + ";boundary=" + BOUNDARY)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(1, WireMock.postRequestedFor(WireMock.urlEqualTo("/test")));
  }

  @Test
  void shouldAddXGatewayHeader() {
    // Given

    // When
    webTestClient.post()
        .uri(PROFILE_URL + UPLOAD_URL)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE + ";boundary=" + BOUNDARY)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(WireMock.postRequestedFor(WireMock.urlEqualTo("/test"))
        .withHeader("X-Gateway", WireMock.equalTo("api-gateway-service")));
  }
}
