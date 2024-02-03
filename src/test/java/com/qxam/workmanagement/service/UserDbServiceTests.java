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
    user =
        User.builder()
            .id(new ObjectId())
            .email("example@example.com")
            .password("12345")
            .enabled(false)
            .build();
  }

  @Test
  void shouldCreateNewUser() throws DuplicateDocuments {
    // Given
    User newUser = mock(User.class);
    when(newUser.getId()).thenReturn(user.getId());
    when(newUser.getEmail()).thenReturn(user.getEmail());
    when(newUser.getPassword()).thenReturn(user.getPassword());
    when(repository.insert(any(User.class))).thenReturn(user);

    // When
    User createdUser = service.createNewUser(newUser);

    // Then
    verify(newUser, times(1)).setEnabled(false);
    assertAll(
        () -> assertEquals(user.getId(), createdUser.getId()),
        () -> assertEquals(user.getEmail(), createdUser.getEmail()),
        () -> assertEquals(user.getPassword(), createdUser.getPassword()),
        () -> assertFalse(createdUser.isEnabled()));
  }

  @Test
  void shouldSaveUser() throws DuplicateDocuments {
    // Given
    when(repository.insert(any(User.class))).thenReturn(user);

    // When
    User savedUser = service.saveUser(user);

    // Then
    assertAll(
        () -> assertEquals(user.getId(), savedUser.getId()),
        () -> assertEquals(user.getEmail(), savedUser.getEmail()),
        () -> assertEquals(user.getPassword(), savedUser.getPassword()),
        () -> assertEquals(user.isEnabled(), savedUser.isEnabled()));
  }

  @Test
  void shouldThrowWhenSavingDuplicates() {
    // Given
    when(repository.insert(any(User.class))).thenThrow(new DuplicateKeyException("Duplicate keys"));

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
    assertFalse(user.isEnabled());
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
  void shouldEnableUser() {
    // Given
    User newUser = mock(User.class);
    when(newUser.getId()).thenReturn(user.getId());
    when(newUser.getEmail()).thenReturn(user.getEmail());
    when(newUser.getPassword()).thenReturn(user.getPassword());

    // When
    service.enableUser(newUser);

    // Then
    verify(newUser, times(1)).setEnabled(true);
  }

  @Test
  void shouldUpdateUser() {
    // Given
    User newUser =
        User.builder()
            .id(new ObjectId())
            .email("changed@changed.com")
            .password("54321")
            .enabled(true)
            .build();
    when(repository.save(any(User.class))).thenReturn(newUser);

    // When
    User updatedUser = service.updateUser(newUser);

    // Then
    assertEquals(updatedUser.getId(), newUser.getId());
    assertEquals(updatedUser.getEmail(), newUser.getEmail());
    assertEquals(updatedUser.getPassword(), newUser.getPassword());
    assertTrue(updatedUser.isEnabled());
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
