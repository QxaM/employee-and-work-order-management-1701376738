package com.qxam.workmanagement.service;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.exception.DuplicateDocuments;
import com.qxam.workmanagement.domain.exception.ElementNotFound;
import com.qxam.workmanagement.repository.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDbService {

  private final UserRepository repository;

  private final PasswordEncoder passwordEncoder;

  public void saveUser(User user) throws DuplicateDocuments {
    User userToSave =
        User.builder()
            .id(user.getId())
            .email(user.getEmail())
            .password(passwordEncoder.encode(user.getPassword()))
            .build();

    try {
      repository.insert(userToSave);
    } catch (DuplicateKeyException e) {
      throw new DuplicateDocuments(
          "User with email " + userToSave.getEmail() + " already exists!", e.getCause());
    }
  }

  public User findUserByEmail(String email) throws ElementNotFound {
    Optional<User> foundUser = repository.findByEmail(email);
    return foundUser.orElseThrow(
        () ->
            new ElementNotFound("User with given email: " + email + " not found in the database!"));
  }

  public User updateUser(User user) {
    User userToSave =
        User.builder()
            .id(user.getId())
            .email(user.getEmail())
            .password(passwordEncoder.encode(user.getPassword()))
            .build();

    return repository.save(userToSave);
  }

  public void deleteUser(String email) {
    repository.deleteUserByEmail(email);
  }
}
