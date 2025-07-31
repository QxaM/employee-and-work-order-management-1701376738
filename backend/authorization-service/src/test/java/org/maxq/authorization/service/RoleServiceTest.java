package org.maxq.authorization.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.exception.DuplicateRoleException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class RoleServiceTest {

  private static final String ROLE_NAME = "ADMIN";

  @Autowired
  private RoleService roleService;

  @MockitoBean
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

  @Test
  void shouldFindRoleByName() throws ElementNotFoundException {
    // Given
    when(roleRepository.findByName(ROLE_NAME)).thenReturn(Optional.of(role));

    // When
    Role foundRole = roleService.getRoleByName(ROLE_NAME);

    // Then
    assertEquals(role.getName(), foundRole.getName(), "Incorrect role found, name should be equal!");
  }

  @Test
  void shouldThrow_When_RoleNotFound() {
    // Given
    when(roleRepository.findByName(anyString())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> roleService.getRoleByName("TEST");

    // Then
    assertThrows(ElementNotFoundException.class, executable, "Role not found should throw ElementNotFoundException");
  }

  @Test
  void shouldReturnAllRoles() {
    // Given
    Role role1 = new Role("ROLE1");
    when(roleRepository.findAll()).thenReturn(List.of(role, role1));

    // When
    List<Role> foundRoles = roleService.getAllRoles();

    // Then
    assertEquals(2, foundRoles.size(), "Wrong number of roles found");
  }

  @Test
  void shouldReturnRoleById() throws ElementNotFoundException {
    // Given
    when(roleRepository.findById(anyLong())).thenReturn(Optional.of(role));

    // When
    Role foundRole = roleService.getRoleById(1L);

    // Then
    assertEquals(role.getName(), foundRole.getName(), "Role name should save with equal name");
  }

  @Test
  void shouldThrow_When_RoleIdNotFound() {
    // Given
    when(roleRepository.findById(anyLong())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> roleService.getRoleById(1L);

    // Then
    assertThrows(ElementNotFoundException.class, executable, "Role not found should throw ElementNotFoundException");
  }
}