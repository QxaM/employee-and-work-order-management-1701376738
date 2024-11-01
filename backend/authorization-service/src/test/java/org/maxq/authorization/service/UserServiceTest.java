package org.maxq.authorization.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceTest {

  @Autowired
  private UserService userService;

  @MockBean
  private UserRepository userRepository;

  private User user;

  @BeforeEach
  void createUser() {
    user = new User(1L, "test@test.com", "test");
  }


  @Test
  void shouldCreateUser() {
    // Given
    when(userRepository.save(user)).thenReturn(user);

    // When
    Executable executable = () -> userService.createUser(user);

    // Then
    assertDoesNotThrow(executable, "Service should not throw when correctly saving user");
    verify(userRepository, times(1)).save(user);
  }

  @Test
  void shouldThrowDuplicateException_When_RepositoryIntegrityException() {
    // Given
    when(userRepository.save(user)).thenThrow(DataIntegrityViolationException.class);

    // When
    Executable executable = () -> userService.createUser(user);

    // Then
    assertThrows(DuplicateEmailException.class, executable,
        "Service should throw DuplicateException when Integrity error detected");
  }

  @Test
  void shouldThrowValidationException_When_RepositoryTransactionException() {
    // Given
    when(userRepository.save(user)).thenThrow(TransactionSystemException.class);

    // When
    Executable executable = () -> userService.createUser(user);

    // Then
    assertThrows(DataValidationException.class, executable,
        "Service should throw DataValidationException when Transaction error detected");
  }

  @Test
  void shouldGetUserByEmail() throws ElementNotFoundException {
    // Given
    when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

    // When
    User foundUser = userService.getUserByEmail(user.getEmail());

    // Then
    assertEquals(foundUser.getId(), user.getId(), "Incorrect user found, ids should be equal!");
    assertEquals(foundUser.getEmail(), user.getEmail(), "Incorrect user found, email should be equal!");
    assertEquals(foundUser.getPassword(), user.getPassword(), "Incorrect user found, password should be equal!");
  }

  @Test
  void shouldThrow_When_UserNotFound() {
    // Given
    when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> userService.getUserByEmail(user.getEmail());

    // Then
    ElementNotFoundException exception = assertThrows(ElementNotFoundException.class, executable,
        "Service should throw ElementNotFoundException when User was not found");
    assertTrue(exception.getMessage().contains(user.getEmail()));
  }
}