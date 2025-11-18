package org.maxq.taskservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.exception.DuplicateDataException;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceTest {

  private User user;

  @Autowired
  private UserService userService;

  @MockitoBean
  private UserRepository userRepository;

  @BeforeEach
  void createUser() {
    user = new User(1L, "test@test.com", Collections.emptySet());
  }

  @Test
  void shouldGetUserById() throws ElementNotFoundException {
    // Given
    when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

    // When
    User foundUsers = userService.getUserById(user.getId());

    // Then
    assertAll(
        () -> assertEquals(user.getId(), foundUsers.getId(), "User with wrong id found"),
        () -> assertEquals(user.getEmail(), foundUsers.getEmail(), "User with wrong email found")
    );
  }

  @Test
  void shouldThrow_When_UserDoesNotExists_When_GetUserById() {
    // Given
    when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> userService.getUserById(user.getId());

    // Then
    assertThrows(ElementNotFoundException.class, executable,
        "Exception should be thrown on empty user");
  }

  @Test
  void shouldCreateUser() throws DuplicateDataException {
    // Given
    when(userRepository.save(user)).thenReturn(user);

    // When
    userService.createUser(user);

    // Then
    verify(userRepository).save(user);
  }

  @Test
  void createShouldThrow_When_SaveThrows() {
    // Given
    doThrow(DataIntegrityViolationException.class).when(userRepository).save(user);

    // When
    Executable executable = () -> userService.createUser(user);

    // Then
    assertThrows(DuplicateDataException.class, executable, "User service should throw");
  }

  @Test
  void shouldUpdateUser() throws DuplicateDataException {
    // Given
    when(userRepository.save(user)).thenReturn(user);

    // When
    userService.updateUser(user);

    // Then
    verify(userRepository).save(user);
  }

  @Test
  void updateShouldThrow_When_SaveThrows() {
    // Given
    doThrow(DataIntegrityViolationException.class).when(userRepository).save(user);

    // When
    Executable executable = () -> userService.updateUser(user);

    // Then
    assertThrows(DuplicateDataException.class, executable, "User service should throw");
  }
}