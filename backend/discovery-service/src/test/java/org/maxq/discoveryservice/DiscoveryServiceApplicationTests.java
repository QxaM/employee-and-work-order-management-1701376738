package org.maxq.discoveryservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "eureka.client.register-with-eureka=false",
    "eureka.client.fetch-registry=false"
})
class DiscoveryServiceApplicationTests {

  @LocalServerPort
  private int port;
  @Autowired
  private TestRestTemplate restTemplate;

  @Test
  void contextLoads() {
    // Explicitly empty - just test Spring configuration
  }

  @Test
  void testEureka() {
    // Given

    // When
    ResponseEntity<String> response = restTemplate
        .getForEntity("http://localhost:" + this.port + "/eureka/apps", String.class);

    // Then
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }
}
