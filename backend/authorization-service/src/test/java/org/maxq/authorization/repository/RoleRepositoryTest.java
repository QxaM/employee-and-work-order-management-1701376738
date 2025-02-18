package org.maxq.authorization.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RoleRepositoryTest {

  @Autowired
  private RoleRepository roleRepository;

  private Role role;

  @BeforeEach
  void setUp() {
    role = new Role("TEST");
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

  @Test
  void shouldThrow_When_DuplicateRoleProvided() {
    // Given
    roleRepository.save(role);
    Role duplicateRole = new Role("TEST");

    // When
    Executable executable = () -> roleRepository.save(duplicateRole);

    // Then
    assertThrows(DataIntegrityViolationException.class, executable);
  }

  @Test
  void shouldFindByName() {
    // Given
    roleRepository.save(role);

    // When
    Optional<Role> foundRole = roleRepository.findByName(role.getName());

    // Then
    assertTrue(foundRole.isPresent(), "Role was not found");
    assertEquals(role.getName(), foundRole.get().getName(),
        "Role name should save with equal name");
  }

  @Test
  void shouldReturnEmpty_When_RoleDoesNotExist() {
    // Given

    // When
    Optional<Role> foundRole = roleRepository.findByName(role.getName());

    // Then
    assertFalse(foundRole.isPresent(), "Role was found ad should not");
  }

  @Test
  void shouldReturnEmpty_When_NoRolesSaved() {
    // Given

    // When
    List<Role> foundRoles = roleRepository.findAll();

    // Then
    assertTrue(foundRoles.isEmpty(), "Roles were found ad should not");
  }

  @Test
  void shouldReturnAllRoles() {
    // Given
    Role role1 = new Role("ROLE1");
    roleRepository.save(role);
    roleRepository.save(role1);

    // When
    List<Role> foundRoles = roleRepository.findAll();

    // Then
    assertEquals(2, foundRoles.size());

    // Clean up
    if (role.getId() != null) {
      roleRepository.deleteById(role.getId());
    }
  }
}
