package org.maxq.authorization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableAsync(proxyTargetClass = true)
@EnableMethodSecurity
public class AuthorizationServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(AuthorizationServiceApplication.class, args);
  }

}
