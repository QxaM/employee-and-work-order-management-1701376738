package org.maxq.authorization.mapper;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserMapper {

  private final PasswordEncoder passwordEncoder;
  private final RoleMapper roleMapper;

  public User mapToUser(UserDto userDto) {
    return new User(
        userDto.getEmail(),
        passwordEncoder.encode(userDto.getPassword())
    );
  }

  public List<GetUserDto> mapToGetUserDtoList(List<User> users) {
    return users.stream().map(user ->
        new GetUserDto(
            user.getId(),
            user.getEmail(),
            user.isEnabled(),
            roleMapper.mapToRoleDtoList(user.getRoles())
        )
    ).toList();
  }
}
