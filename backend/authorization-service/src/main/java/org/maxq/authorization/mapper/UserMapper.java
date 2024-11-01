package org.maxq.authorization.mapper;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserMapper {

  private final PasswordEncoder passwordEncoder;

  public User mapToUser(UserDto userDto) {
    return new User(
        userDto.getId(),
        userDto.getEmail(),
        passwordEncoder.encode(userDto.getPassword())
    );
  }
}
