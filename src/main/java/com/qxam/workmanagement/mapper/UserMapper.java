package com.qxam.workmanagement.mapper;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

  public User mapToUser(UserDto userDto) {
    return User.builder()
        .id(userDto.getId())
        .email(userDto.getEmail())
        .password(userDto.getPassword())
        .build();
  }

  public UserDto mapToUserDto(User user) {
    return UserDto.builder()
        .id(user.getId())
        .email(user.getEmail())
        .password(user.getPassword())
        .build();
  }
}
