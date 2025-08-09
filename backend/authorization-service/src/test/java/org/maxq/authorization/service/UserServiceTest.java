package org.maxq.authorization.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.*;
import org.maxq.authorization.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.TransactionSystemException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceTest {

  @Autowired
  private UserService userService;

  @MockitoBean
  private UserRepository userRepository;
  @MockitoBean
  private RoleService roleService;

  private User user;
  private Role role;

  @BeforeEach
  void createUser() {
    role = new Role(1L, "admin", Collections.emptyList());
    user = new User(1L, "test@test.com", "test", false, Set.of(role));
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
  void shouldUpdateUser_When_ValidDataProvided() {
    // Given
    when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenReturn(user);

    // When
    Executable executable = () -> userService.updateUser(user);

    // Then
    assertDoesNotThrow(executable, "Service should not throw when correctly saving user");
    verify(userRepository, times(1)).save(user);
  }

  @Test
  void shouldThrowValidationException_When_RepositoryTransactionExceptionDuringUpdate() {
    // Given
    when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenThrow(TransactionSystemException.class);

    // When
    Executable executable = () -> userService.updateUser(user);

    // Then
    assertThrows(DataValidationException.class, executable,
        "Service should throw DataValidationException when Transaction error detected");
  }

  @Test
  void shouldThrowElementNotFound_When_WrongUserProvided() {
    // Given
    when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> userService.updateUser(user);

    // Then
    assertThrows(ElementNotFoundException.class, executable,
        "Service should throw ElementNotFoundException when User was not found");
  }

  @Test
  void shouldGetUserByEmail() throws ElementNotFoundException {
    // Given
    when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

    // When
    User foundUser = userService.getUserByEmail(user.getEmail());

    // Then
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
    assertTrue(exception.getMessage().contains(user.getEmail()),
        "Exception message should contain email that lead to an error");
  }

  @Test
  void shouldReturnAllUsers() {
    // Given
    User user1 = new User("test1@test.com", "test1", Set.of(role));
    Pageable pageable = Pageable.ofSize(10).withPage(0);
    Page<User> userPage = new PageImpl<>(List.of(user, user1), pageable, 2);
    when(userRepository.findAll(pageable)).thenReturn(userPage);

    // When
    Page<User> foundUsers = userService.getAllUsers(0, 10);

    // Then
    assertAll(
        () -> assertEquals(2, foundUsers.getNumberOfElements(),
            "Incorrect number of users found"),
        () -> assertEquals(user.getEmail(), foundUsers.getContent().getFirst().getEmail(),
            "Incorrect user found, email should be equal!"),
        () -> assertEquals(user1.getEmail(), foundUsers.getContent().get(1).getEmail(),
            "Incorrect user found, email should be equal!"),
        () -> assertEquals(2, foundUsers.getTotalElements(),
            "Incorrect total number of users found"),
        () -> assertEquals(1, foundUsers.getTotalPages(),
            "Incorrect total number of pages found")
    );
  }

  @Test
  void shouldReturnUserById() throws ElementNotFoundException {
    // Given
    when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

    // When
    User foundUser = userService.getUserById(1L);

    // Then
    assertAll(
        () -> assertEquals(user.getEmail(), foundUser.getEmail(),
            "User email should save with equal value"),
        () -> assertEquals(user.getPassword(), foundUser.getPassword(),
            "User password should save with equal value")
    );
  }

  @Test
  void shouldThrow_When_UserIdNotFound() {
    // Given
    when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> userService.getUserById(1L);

    // Then
    assertThrows(ElementNotFoundException.class, executable, "Role not found should throw ElementNotFoundException");
  }

  @Test
  void shouldAddUserRole() throws ElementNotFoundException, RoleAlreadyExistsException {
    // Given
    User userToUpdate = new User(1L, "test@test.com", "test", false, new HashSet<>(List.of(role)));
    Role newRole = new Role(2L, "ROLE2", Collections.emptyList());
    when(roleService.getRoleById(newRole.getId())).thenReturn(newRole);

    // When
    userService.addRole(userToUpdate, newRole.getId());

    // Then
    verify(userRepository, times(1))
        .save(argThat(updatedUser -> updatedUser.getRoles().contains(newRole)));
    assertTrue(userToUpdate.getRoles().contains(newRole), "Role should be added to user");
  }

  @Test
  void shouldThrow_When_RoleAlreadyExists() throws ElementNotFoundException {
    // Given
    Role newRole = new Role(2L, "ROLE2", Collections.emptyList());
    User userToUpdate = new User(1L, "test@test.com", "test",
        false, new HashSet<>(List.of(role, newRole)));
    when(roleService.getRoleById(newRole.getId())).thenReturn(newRole);

    // When
    Executable executable = () -> userService.addRole(userToUpdate, newRole.getId());

    // Then
    assertThrows(RoleAlreadyExistsException.class, executable);
  }

  @Test
  void shouldRemoveUserRole() throws ElementNotFoundException, RoleDoesNotExistException {
    // Given
    Role deleteRole = new Role(2L, "ROLE2", Collections.emptyList());
    User userToUpdate = new User(1L, "test@test.com", "test",
        false, new HashSet<>(List.of(role, deleteRole)));
    when(roleService.getRoleById(deleteRole.getId())).thenReturn(deleteRole);

    // When
    userService.removeRole(userToUpdate, deleteRole.getId());

    // Then
    verify(userRepository, times(1))
        .save(argThat(updatedUser -> !updatedUser.getRoles().contains(deleteRole)));
    assertFalse(userToUpdate.getRoles().contains(deleteRole), "Role should be removed from user");
  }

  @Test
  void shouldThrow_When_RoleDoesNotExist() throws ElementNotFoundException {
    // Given
    Role newRole = new Role(2L, "ROLE2", Collections.emptyList());
    User userToUpdate = new User(1L, "test@test.com", "test",
        false, new HashSet<>(List.of(role)));
    when(roleService.getRoleById(newRole.getId())).thenReturn(newRole);

    // When
    Executable executable = () -> userService.removeRole(userToUpdate, newRole.getId());

    // Then
    assertThrows(RoleDoesNotExistException.class, executable);
  }
}