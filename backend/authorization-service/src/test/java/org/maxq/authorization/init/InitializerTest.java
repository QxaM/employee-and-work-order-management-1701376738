package org.maxq.authorization.init;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.repository.RoleRepository;
import org.maxq.authorization.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestPropertySource(properties = {"app.init=true"})
class InitializerTest {

  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private UserRepository userRepository;

  @AfterEach
  void cleanUp() {
    Optional<User> admin = userRepository.findByEmail("admin@maxq.com");
    Optional<User> operator = userRepository.findByEmail("operator@maxq.com");
    Optional<User> designer = userRepository.findByEmail("designer@maxq.com");

    admin.ifPresent(user -> userRepository.deleteById(user.getId()));
    operator.ifPresent(user -> userRepository.deleteById(user.getId()));
    designer.ifPresent(user -> userRepository.deleteById(user.getId()));

    Optional<Role> adminRole = roleRepository.findByName("ADMIN");
    Optional<Role> operatorRole = roleRepository.findByName("OPERATOR");
    Optional<Role> designerRole = roleRepository.findByName("DESIGNER");

    adminRole.ifPresent(role -> roleRepository.deleteById(role.getId()));
    operatorRole.ifPresent(role -> roleRepository.deleteById(role.getId()));
    designerRole.ifPresent(role -> roleRepository.deleteById(role.getId()));
  }

  @Test
  void shouldCorrectlyInitData() {
    // Given

    // When
    Optional<Role> adminRole = roleRepository.findByName("ADMIN");
    Optional<Role> operatorRole = roleRepository.findByName("OPERATOR");
    Optional<Role> designerRole = roleRepository.findByName("DESIGNER");

    Optional<User> admin = userRepository.findByEmail("admin@maxq.com");
    Optional<User> operator = userRepository.findByEmail("operator@maxq.com");
    Optional<User> designer = userRepository.findByEmail("designer@maxq.com");

    // Then
    assertAll(
        () -> assertTrue(adminRole.isPresent(), "ADMIN role should be present after init"),
        () -> assertTrue(operatorRole.isPresent(), "OPERATOR should be present after init"),
        () -> assertTrue(designerRole.isPresent(), "DESIGNER should be present after init")
    );
    assertAll(
        () -> assertTrue(admin.isPresent(), "Admin should exist after initialization"),
        () -> assertTrue(operator.isPresent(), "Operator should exist after initialization"),
        () -> assertTrue(designer.isPresent(), "Designer should exist after initialization")
    );
  }
}