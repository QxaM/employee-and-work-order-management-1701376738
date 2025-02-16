package org.maxq.authorization.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class RoleRepositoryTest {

  @Autowired
  private RoleRepository roleRepository;

  private Role role;

  @BeforeEach
  void setUp() {
    role = new Role("ADMIN");
  }

  @AfterEach
  void tearDown() {
    if (role.getId() != null) {
      roleRepository.deleteById(role.getId());
    }
  }

  @Test
  void shouldSaveRole() {
    // Given
    roleRepository.save(role);

    // When
    Optional<Role> foundRole = roleRepository.findById(role.getId());

    // Then
    assertTrue(foundRole.isPresent(), "Role was not saved correctly");
    assertEquals(role.getName(), foundRole.get().getName(),
        "Role name should save with equal name");
  }
}
