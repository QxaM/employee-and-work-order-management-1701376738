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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public void createUser(User user) throws DuplicateEmailException, DataValidationException {
    try {
      userRepository.save(user);
    } catch (DataIntegrityViolationException e) {
      throw new DuplicateEmailException(
          "User with this email already exists! Email: " + user.getEmail(), e);
    } catch (TransactionSystemException e) {
      throw new DataValidationException("Failed email or password validation", e);
    }
  }

  public User getUserByEmail(String email) throws ElementNotFoundException {
    Optional<User> user = userRepository.findByEmail(email);
    return user.orElseThrow(() ->
        new ElementNotFoundException("User with email '" + email + "' does not exist"));
  }
}
