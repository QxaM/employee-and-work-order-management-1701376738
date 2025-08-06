package org.maxq.apigatewayservice.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Duration;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
@ActiveProfiles({"DEV"})
public class TokenControllerDevTest {

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
  }

  @Test
  void shouldReturnLongLastingToken() {
    // Given
    int days = 10;
    String serviceUrl = "/service";

    // When + Then
    webTestClient.post()
        .uri(serviceUrl + "/long-token?days=" + days)
        .exchange()
        .expectStatus().isOk()
        .expectBody().jsonPath("$.token").isNotEmpty();
  }
}
