package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.*;
import org.maxq.authorization.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final RoleService roleService;

  public void createUser(User user) throws DuplicateEmailException, DataValidationException {
    try {
      userRepository.save(user);
    } catch (TransactionSystemException e) {
      throw new DataValidationException("Failed email or password validation", e);
    } catch (DataIntegrityViolationException e) {
      throw new DuplicateEmailException(
          "User with this email already exists! Email: " + user.getEmail(), e);
    }
  }

  public void updateUser(User user) throws ElementNotFoundException, DataValidationException {
    Optional<User> foundUser = userRepository.findById(user.getId());
    if (foundUser.isEmpty()) {
      throw new ElementNotFoundException("User with id '" + user.getId() + "' does not exist");
    }

    try {
      userRepository.save(user);
    } catch (TransactionSystemException e) {
      throw new DataValidationException("Failed email or password validation", e);
    }
  }

  public User getUserById(Long userId) throws ElementNotFoundException {
    Optional<User> user = userRepository.findById(userId);
    return user.orElseThrow(() ->
        new ElementNotFoundException("User with id '" + userId + "' does not exist"));
  }

  public User getUserByEmail(String email) throws ElementNotFoundException {
    Optional<User> user = userRepository.findByEmail(email);
    return user.orElseThrow(() ->
        new ElementNotFoundException("User with email '" + email + "' does not exist"));
  }

  public Page<User> getAllUsers(int number, int size) {
    Pageable page = Pageable.ofSize(size).withPage(number);
    return userRepository.findAll(page);
  }

  public void addRole(User user, Long roleId) throws ElementNotFoundException, RoleAlreadyExistsException {
    Role role = roleService.getRoleById(roleId);
    boolean success = user.getRoles().add(role);
    if (!success) {
      throw new RoleAlreadyExistsException(
          "Role '" + role.getName() + "' already exists on user: " + user.getId());
    }
    userRepository.save(user);
  }

  public void removeRole(User user, Long roleId) throws ElementNotFoundException, RoleDoesNotExistException {
    Role role = roleService.getRoleById(roleId);
    boolean success = user.getRoles().remove(role);
    if (!success) {
      throw new RoleDoesNotExistException(
          "Role '" + role.getName() + "' does not exist on user: " + user.getId());
    }
    userRepository.save(user);
  }
}
