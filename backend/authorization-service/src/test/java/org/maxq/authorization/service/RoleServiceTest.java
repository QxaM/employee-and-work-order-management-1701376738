package org.maxq.authorization.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.exception.DuplicateRoleException;
import org.maxq.authorization.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class RoleServiceTest {

  private static final String ROLE_NAME = "ADMIN";

  @Autowired
  private RoleService roleService;

  @MockBean
  private RoleRepository roleRepository;

  private Role role;

  @BeforeEach
  void setUp() {
    role = new Role(ROLE_NAME);
  }

  @Test
  void shouldCreateRole() {
    // Given
    when(roleRepository.save(any(Role.class))).thenReturn(role);

    // When
    Executable executable = () -> roleService.createRole(ROLE_NAME);

    // Then
    assertDoesNotThrow(executable, "Creating new role should not throw any exception");
    verify(roleRepository, atLeast(1))
        .save(argThat(authority -> ROLE_NAME.equals(authority.getName())));
  }

  @Test
  void shouldThrow_When_RoleAlreadyExists() {
    // Given
    when(roleRepository.save(any(Role.class)))
        .thenThrow(new DataIntegrityViolationException("Test error"));

    // When
    Executable executable = () -> roleService.createRole(ROLE_NAME);

    // Then
    assertThrows(DuplicateRoleException.class, executable,
        "Creating duplicated role should throw DuplicateRoleException");
  }
}