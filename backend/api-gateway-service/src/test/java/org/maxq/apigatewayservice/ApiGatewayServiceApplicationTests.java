package org.maxq.apigatewayservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
class ApiGatewayServiceApplicationTests {

  @Test
  void contextLoads() {
    // Explicitly empty - just test Spring configuration
  }

}
