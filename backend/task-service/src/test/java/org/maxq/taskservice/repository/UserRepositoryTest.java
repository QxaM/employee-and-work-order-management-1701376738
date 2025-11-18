package org.maxq.taskservice.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.taskservice.domain.Role;
import org.maxq.taskservice.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Collections;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

  private User user;

  @Autowired
  private UserRepository repository;

  @BeforeEach
  void createUser() {
    user = new User(1L, "test@test.com", Collections.emptySet());
  }

  @AfterEach
  void deleteUser() {
    repository.deleteAll();
  }

  @Test
  void shouldSaveUser() {
    // Given

    // When
    repository.save(user);

    // Then
    Optional<User> optionalUser = repository.findById(user.getId());
    assertTrue(optionalUser.isPresent(), "User was not created properly");

    User foundUser = optionalUser.get();
    assertAll(
        () -> assertEquals(user.getId(), foundUser.getId(), "Id was not saved correctly"),
        () -> assertEquals(user.getEmail(), foundUser.getEmail(), "Email was not saved correctly")
    );
  }

  @Test
  void shouldSaveUserWithRole() {
    // Given
    Long roleId = new Random().nextLong();
    Role role = new Role(roleId, "ROLE_TEST");
    User userWithRole = new User(user.getId(), "test@test.com", Set.of(role));

    // When
    repository.save(userWithRole);

    // Then
    Optional<User> optionalUser = repository.findById(userWithRole.getId());
    assertTrue(optionalUser.isPresent(), "User was not created properly");

    User foundUser = optionalUser.get();
    assertEquals(1, foundUser.getRoles().size(), "Roles were not saved correctly");

    Role savedRole = foundUser.getRoles().stream().toList().getFirst();
    assertAll(
        () -> assertEquals(role.getId(), savedRole.getId(), "Role id was not saved correctly"),
        () -> assertEquals(role.getName(), savedRole.getName(), "Role name was not saved correctly")
    );
  }

  @Test
  void shouldThrowWhenDuplicateEmail() {
    // Given
    User userWithSameEmail = new User(user.getId() + 1, "test@test.com", Collections.emptySet());

    repository.save(user);

    // When
    Executable executable = () -> repository.save(userWithSameEmail);

    // Then
    assertThrows(DataIntegrityViolationException.class, executable,
        "Should throw exception on duplicate emails");
  }

  @Test
  void shouldThrowWhenDuplicateRoleName() {
    // Given
    Long roleId = new Random().nextLong();
    Role role = new Role(roleId, "ROLE_TEST_DUPLICATE");
    User userWithRole = new User(user.getId(), "test@test.com", Set.of(role));

    repository.save(userWithRole);

    Role duplicateNameRole = new Role(role.getId() + 1, role.getName());
    User userWithDuplicateNameRole = new User(
        user.getId() + 1,
        "test1@test.com",
        Set.of(duplicateNameRole)
    );

    // When
    Executable executable = () -> repository.save(userWithDuplicateNameRole);

    // Then
    assertThrows(DataIntegrityViolationException.class, executable,
        "Should throw exception on duplicate roles");
  }

  @Test
  void shouldUpdateUser() {
    // Given
    repository.save(user);

    User updatedUser = new User(user.getId(), "updated@test.com", user.getRoles());

    // When
    repository.save(updatedUser);

    // Then
    Optional<User> optionalUser = repository.findById(updatedUser.getId());
    assertTrue(optionalUser.isPresent(), "User was not updated properly");

    User foundUser = optionalUser.get();
    assertAll(
        () -> assertEquals(updatedUser.getId(), foundUser.getId(), "Id was not updated correctly"),
        () -> assertEquals(updatedUser.getEmail(), foundUser.getEmail(),
            "Email was not updated correctly")
    );
  }

  @Test
  void shouldUpdateUserAndRole() {
    // Given
    Long roleId = new Random().nextLong();
    Role role = new Role(roleId, "ROLE_TEST_UPDATE");
    User userWithRole = new User(user.getId(), "test@test.com", Set.of(role));

    repository.save(userWithRole);

    Role updatedRole = new Role(roleId, "UPDATED_ROLE");
    User updatedUser = new User(userWithRole.getId(), userWithRole.getEmail(), Set.of(updatedRole));

    // When
    repository.save(updatedUser);

    // Then
    Optional<User> optionalUser = repository.findById(updatedUser.getId());
    assertTrue(optionalUser.isPresent(), "User was not updated properly");

    User foundUser = optionalUser.get();
    assertEquals(1, foundUser.getRoles().size(), "Roles were not saved correctly");

    Role foundRole = foundUser.getRoles().stream().toList().getFirst();
    assertAll(
        () -> assertEquals(updatedRole.getId(), foundRole.getId(),
            "Role was not updated correctly"),
        () -> assertEquals(updatedRole.getName(), foundRole.getName(),
            "Role name was not updated correctly")
    );
  }

  @Test
  void shouldFindUserById() {
    // Given
    repository.save(user);

    // When
    Optional<User> optionalUser = repository.findById(user.getId());

    // Then
    assertTrue(optionalUser.isPresent(), "User was not found properly");

    User foundUser = optionalUser.get();
    assertAll(
        () -> assertEquals(user.getId(), foundUser.getId(),
            "Id is not correct - fetch not executed properly"),
        () -> assertEquals(user.getEmail(), foundUser.getEmail(),
            "Email is not correct - fetch not executed properly")
    );
  }

  @Test
  void shouldDeleteUserById() {
    // Given
    repository.save(user);

    // When
    repository.deleteById(user.getId());

    // Then
    Optional<User> foundUser = repository.findById(user.getId());
    assertTrue(foundUser.isEmpty(), "User was not deleted properly");
  }
}