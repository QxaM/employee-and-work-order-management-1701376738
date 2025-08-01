package org.maxq.authorization.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.TransactionSystemException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

  private static final String EMAIL = "test@test.com";

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private RoleRepository roleRepository;

  private User user;
  private Role role;

  static Stream<Arguments> createWrongPasswords() {
    List<User> users = List.of(
        new User(EMAIL, null),
        new User(EMAIL, "12")
    );

    return users.stream().map(Arguments::of);
  }

  @BeforeEach
  void createUser() {
    role = new Role("admin");
    roleRepository.save(role);
    user = new User(EMAIL, "test", Set.of(role));
  }

  @AfterEach
  void deleteUser() {
    if (user.getId() != null) {
      userRepository.deleteById(user.getId());
    }
    if (role.getId() != null) {
      roleRepository.deleteById(role.getId());
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
  void shouldFindByEmail() {
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

  @Test
  void shouldUpdateUser() {
    // Given
    userRepository.save(user);

    // When
    User updatedUser = new User(user.getId(), "updated@email.com", user.getPassword(),
        user.isEnabled(), user.getRoles());
    userRepository.save(updatedUser);

    // Then
    Optional<User> foundUser = userRepository.findById(updatedUser.getId());
    assertTrue(foundUser.isPresent(), "User could not be found");

    User fetchedUser = foundUser.get();
    assertAll(() -> {
      assertEquals(updatedUser.getId(), fetchedUser.getId(), "User ID should match after update");
      assertEquals(updatedUser.getEmail(), fetchedUser.getEmail(),
          "User email should match after update");
      assertEquals(updatedUser.getPassword(), fetchedUser.getPassword(),
          "User password should match after update");
      assertEquals(updatedUser.isEnabled(), fetchedUser.isEnabled(),
          "User enabled status should match after update");
    });
  }

  @Test
  void shouldReturnUserWithRole() {
    // Given
    userRepository.save(user);

    // When
    Optional<User> foundUser = userRepository.findById(user.getId());

    // Then
    assertTrue(foundUser.isPresent(), "User could not be found");
    assertEquals(user.getRoles().size(), foundUser.get().getRoles().size(),
        "User should have exactly one role");
    assertTrue(user.getRoles().containsAll(foundUser.get().getRoles()),
        "User should have correct roles fetched from database");
  }

  @Test
  void shouldReturnEmpty_When_NoUserExists() {
    // Given
    Pageable page = Pageable.ofSize(10).withPage(0);

    // When
    Page<User> foundUsers = userRepository.findAll(page);

    // Then
    assertTrue(foundUsers.isEmpty(), "User was found ad should not");
    assertAll(
        () -> assertEquals(0, foundUsers.getNumberOfElements(),
            "Should not return any users on page"),
        () -> assertEquals(0, foundUsers.getTotalPages(),
            "Should not return any pages"),
        () -> assertEquals(0, foundUsers.getTotalElements(),
            "Should not return any elements")
    );
  }

  @Test
  void shouldReturnFoundUsers() {
    // Given
    Pageable page = Pageable.ofSize(10).withPage(0);
    User user1 = new User("test1@test.com", "test1", Set.of(role));
    userRepository.save(user);
    userRepository.save(user1);

    // When
    Page<User> foundUsers = userRepository.findAll(page);

    // Then
    assertAll(
        () -> assertEquals(2, foundUsers.getNumberOfElements(), "Wrong number of users found!"),
        () -> assertEquals(1, foundUsers.getTotalPages(), "Should return only one page"),
        () -> assertEquals(2, foundUsers.getTotalElements(), "Should return two users")
    );

    // Cleanup
    userRepository.deleteById(user1.getId());
  }

  @Test
  void shouldFindById() {
    // Given
    userRepository.save(user);

    // When
    Optional<User> foundUser = userRepository.findById(user.getId());

    // Then
    assertTrue(foundUser.isPresent(), "Role was not found");
    assertEquals(user.getEmail(), foundUser.get().getEmail(),
        "User email should save with equal name");
    assertEquals(user.getPassword(), foundUser.get().getPassword(),
        "User password should save with equal name");
  }

  @Test
  void shouldNot_FindById_WhenUserDontExist() {
    // Given
    Long id = Long.MAX_VALUE;

    // When
    Optional<User> foundUser = userRepository.findById(id);

    // Then
    assertFalse(foundUser.isPresent(), "Role was found ad should not");
  }
}