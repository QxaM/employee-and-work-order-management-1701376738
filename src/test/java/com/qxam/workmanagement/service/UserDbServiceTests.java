package com.qxam.workmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.exception.DuplicateDocuments;
import com.qxam.workmanagement.domain.exception.ElementNotFound;
import com.qxam.workmanagement.repository.UserRepository;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DuplicateKeyException;

@SpringBootTest
class UserDbServiceTests {

  @Autowired private UserDbService service;

  @MockBean private UserRepository repository;

  private static User user;

  @BeforeAll
  static void createUser() {
    user = new User(new ObjectId(), "example@example.com", "12345");
  }

  @Test
  void shouldSaveUser() throws DuplicateDocuments {
    // Given

    // When
    service.saveUser(user);

    // Then
    verify(repository, times(1)).insert(user);
  }

  @Test
  void shouldThrowWhenSavingDuplicates() {
    // Given
    when(repository.insert(user)).thenThrow(new DuplicateKeyException("Duplicate keys"));

    // When

    // Then
    assertThrows(DuplicateDocuments.class, () -> service.saveUser(user));
  }

  @Test
  void shouldFindUserByEmail() throws ElementNotFound {
    // Given
    when(repository.findByEmail(user.getEmail())).thenReturn(Optional.ofNullable(user));

    // When
    User foundUser = service.findUserByEmail(user.getEmail());

    // Then
    assertNotNull(foundUser);
    assertEquals(user.getId(), foundUser.getId());
    assertEquals(user.getEmail(), foundUser.getEmail());
    assertEquals(user.getPassword(), foundUser.getPassword());
  }

  @Test
  void shouldThrowWhenUserDoesNotExist() {
    // Given
    when(repository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
    // When

    // Then
    assertThrows(ElementNotFound.class, () -> service.findUserByEmail(user.getEmail()));
  }

  @Test
  void shouldUpdateUser() {
    // Given
    User newUser = new User(user.getId(), "changed@changed.com", "54321");
    when(repository.save(newUser)).thenReturn(newUser);

    // When
    User updatedUser = service.updateUser(newUser);

    // Then
    assertEquals(updatedUser.getId(), newUser.getId());
    assertEquals(updatedUser.getEmail(), newUser.getEmail());
    assertEquals(updatedUser.getPassword(), newUser.getPassword());
  }

  @Test
  void shouldDeleteUser() {
    // Given

    // When
    service.deleteUser(user.getEmail());

    // Then
    verify(repository, times(1)).deleteUserByEmail(user.getEmail());
  }
}
