package org.maxq.apigatewayservice.controller;

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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.time.Duration;
import java.util.Base64;

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
class BasicTokenGatewayFilterFactoryTest {

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

    stubFor(WireMock.post("/login")
        .willReturn(WireMock.ok()));
  }

  @Test
  void shouldAddCustomBasicHeader() {
    // Given
    String basicToken = Base64.getEncoder().encodeToString("test:test".getBytes());
    String headerToken = "Basic " + basicToken;
    String authUri = "/api/auth";

    // When
    webTestClient.post()
        .uri(authUri + "/login")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, headerToken)
        .exchange()
        .expectStatus().isOk();

    // Then
    verify(WireMock.postRequestedFor(WireMock.urlEqualTo("/login"))
        .withHeader("X-Basic-Authorization", WireMock.equalTo(basicToken))
        .withHeader("Authorization", WireMock.matching("Bearer .+")));
  }
}
