package org.maxq.taskservice.service;

import lombok.RequiredArgsConstructor;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.exception.DuplicateDataException;
import org.maxq.taskservice.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public void createUser(User user) throws DuplicateDataException {
    try {
      userRepository.save(user);
    } catch (DataIntegrityViolationException e) {
      throw new DuplicateDataException("Duplicate user email or role name during user creation", e);
    }
  }
}
