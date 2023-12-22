package com.qxam.workmanagement.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.qxam.workmanagement.domain.User;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataMongoTest
@TestPropertySource(locations = "classpath:test.properties")
class UserRepositoryTests {

  @Autowired private UserRepository repository;

  private User user;

  @BeforeEach
  void createUser() {
    user = new User(new ObjectId(), "example@example.com", "12345");
  }

  @AfterEach
  void deleteUser() {
    repository.deleteById(user.getId());
  }

  @Test
  void shouldSaveUser() {
    // Given

    // When
    repository.insert(user);
    Optional<User> foundUser = repository.findById(user.getId());

    // Then
    assertTrue(foundUser.isPresent());
    assertEquals(user.getEmail(), foundUser.get().getEmail());
    assertEquals(user.getPassword(), foundUser.get().getPassword());
  }

  @Test
  void shouldNotAddUserWithSameEmail() {
    // Given
    repository.insert(user);

    // When
    User user2 = new User(new ObjectId(), "example@example.com", "12345");

    // Then
    assertThrows(DuplicateKeyException.class, () -> repository.insert(user2));
  }

  @Test
  void shouldFindUser() {
    // Given
    repository.insert(user);

    // When
    Optional<User> foundUser = repository.findByEmail(user.getEmail());

    // Then
    assertTrue(foundUser.isPresent());
    assertEquals(user.getId(), foundUser.get().getId());
    assertEquals(user.getPassword(), foundUser.get().getPassword());
  }

  @Test
  void shouldUpdateUser() {
    // Given
    repository.insert(user);

    // When
    User changedUser = new User(user.getId(), "changed@changed.com", "54321");
    repository.save(changedUser);
    Optional<User> foundUser = repository.findById(user.getId());

    // Then
    assertTrue(foundUser.isPresent());
    assertEquals(changedUser.getEmail(), foundUser.get().getEmail());
    assertEquals(changedUser.getPassword(), foundUser.get().getPassword());
  }

  @Test
  void shouldDeleteUserByEmail() {
    // Given
    repository.insert(user);

    // When
    repository.deleteUserByEmail(user.getEmail());
    Optional<User> foundUser = repository.findById(user.getId());

    // Then
    assertTrue(foundUser.isEmpty());
  }
}
