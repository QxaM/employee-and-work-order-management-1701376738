package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

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

  public User getUserByEmail(String email) throws ElementNotFoundException {
    Optional<User> user = userRepository.findByEmail(email);
    return user.orElseThrow(() ->
        new ElementNotFoundException("User with email '" + email + "' does not exist"));
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }
}
