package org.maxq.authorization.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.authorization.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

  private static final String EMAIL = "test@test.com";

  @Autowired
  private UserRepository userRepository;

  private User user;

  static Stream<Arguments> createWrongPasswords() {
    List<User> users = List.of(
        new User(EMAIL, null),
        new User(EMAIL, "12")
    );

    return users.stream().map(Arguments::of);
  }

  @BeforeEach
  void createUser() {
    user = new User(EMAIL, "test");
  }

  @AfterEach
  void deleteUser() {
    if (user.getId() != null) {
      userRepository.deleteById(user.getId());
    }
  }

  @Test
  void shouldSaveUser() {
    // Given

    // When
    userRepository.save(user);
    Long id = user.getId();
    Optional<User> foundUser = userRepository.findById(id);

    // When
    assertTrue(foundUser.isPresent(), "User was not saved correctly - not found");
    assertEquals(foundUser.get().getEmail(), user.getEmail(),
        "User was not saved correctly - email does not match");
    assertEquals(foundUser.get().getPassword(), user.getPassword(),
        "User was not saved correctly - password does not match");
  }

  @Test
  void shouldNotSaveDuplicate() {
    // Given
    User duplicateUser = new User(EMAIL, "test");
    userRepository.save(user);

    // When
    Executable executable = () -> userRepository.save(duplicateUser);

    // Then
    assertThrows(DataIntegrityViolationException.class, executable,
        "Repository should throw error when trying to save duplicate user");

    // Cleanup
    userRepository.deleteById(duplicateUser.getId());
  }

  @Test
  void shouldNotSaveWithEmptyEmail() {
    // Given
    User emptyEmail = new User(null, "test");

    // When
    Executable executable = () -> userRepository.save(emptyEmail);

    // Then
    assertThrows(TransactionSystemException.class, executable,
        "Repository should throw error when trying to save user with empty email");

    // Cleanup
    if (emptyEmail.getEmail() != null) {
      userRepository.deleteById(emptyEmail.getId());
    }
  }

  @ParameterizedTest
  @MethodSource("createWrongPasswords")
  void shouldNotSaveWithWrongPasswords(User wrongPasswordUser) {
    // Given

    // When
    Executable executable = () -> userRepository.save(wrongPasswordUser);

    // Then
    assertThrows(TransactionSystemException.class, executable,
        String.format("Repository should throw error when trying to save user with wrong password: %s",
            wrongPasswordUser.getPassword()));

    // Cleanup
    if (wrongPasswordUser.getPassword() != null) {
      userRepository.deleteById(wrongPasswordUser.getId());
    }

  }

  @Test
  void findByEmail() {
    // Given
    userRepository.save(user);

    // When
    Optional<User> foundUser = userRepository.findByEmail(user.getEmail());

    // Then
    assertTrue(foundUser.isPresent(), "User could not be found");
    assertEquals(foundUser.get().getId(), user.getId(),
        "Wrong user was fetched - id does not match");
    assertEquals(foundUser.get().getEmail(), user.getEmail(),
        "Wrong user was fetched - email does not match");
    assertEquals(foundUser.get().getPassword(), user.getPassword(),
        "Wrong user was fetched - password does not match");
  }
}