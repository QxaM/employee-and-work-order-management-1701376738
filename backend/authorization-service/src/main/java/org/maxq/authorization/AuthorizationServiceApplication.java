package org.maxq.authorization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync(proxyTargetClass = true)
public class AuthorizationServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(AuthorizationServiceApplication.class, args);
  }

}
