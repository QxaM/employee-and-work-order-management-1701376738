package org.maxq.apigatewayservice.route.routing;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Duration;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8761)
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
class EurekaServiceTest {

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

    stubFor(WireMock.get("/eureka/apps").willReturn(WireMock.ok()));
  }

  @Test
  void shouldRouteToDownstreamService() {
    // Given
    String registeredApps = "/service/registered-apps";

    // When
    webTestClient.get()
        .uri(registeredApps)
        .exchange()
        .expectStatus().isOk();

    // This
    verify(WireMock.getRequestedFor(WireMock.urlEqualTo("/eureka/apps")));
  }

  @Test
  void shouldAddAcceptHeader() {
    // Given
    String registeredApps = "/service/registered-apps";

    // When
    webTestClient.get()
        .uri(registeredApps)
        .exchange()
        .expectStatus().isOk();

    // This
    verify(WireMock.getRequestedFor(WireMock.urlEqualTo("/eureka/apps"))
        .withHeader("Accept", WireMock.equalTo("application/json")));
  }

  @Test
  void shouldRewriteAcceptHeader_When_AlreadyExists() {
    // Given
    String registeredApps = "/service/registered-apps";

    // When
    webTestClient.get()
        .uri(registeredApps)
        .header("Accept", "application/xml")
        .exchange()
        .expectStatus().isOk();

    // This
    verify(WireMock.getRequestedFor(WireMock.urlEqualTo("/eureka/apps"))
        .withHeader("Accept", WireMock.equalTo("application/json")));
  }
}
