package org.maxq.taskservice.mapper;

import org.maxq.taskservice.domain.Role;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.UserDto;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class UserMapper {

  public User mapToUser(UserDto userDto) {
    Set<Role> roles = Set.copyOf(
        userDto.getRoles().stream().map(roleDto -> new Role(
            roleDto.getId(),
            roleDto.getName()
        )).toList()
    );
    return new User(userDto.getId(), userDto.getEmail(), roles);
  }
}
