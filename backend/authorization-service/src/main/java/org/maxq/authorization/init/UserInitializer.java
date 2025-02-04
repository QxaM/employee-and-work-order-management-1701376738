package org.maxq.authorization.init;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserInitializer {
  private static final String TEST_EMAIL = "test@maxq.com";
  private static final String TEST_PASSWORD = "Test12345";

  private final UserService userService;
  private final PasswordEncoder passwordEncoder;

  @PostConstruct
  public void init() {
    @SuppressWarnings("java:S6437")
    User user = new User(TEST_EMAIL, passwordEncoder.encode(TEST_PASSWORD));

    try {
      userService.createUser(user);
      log.info("Default user created");
    } catch (Exception e) {
      log.info("Default user already exists");
    }
  }
}
