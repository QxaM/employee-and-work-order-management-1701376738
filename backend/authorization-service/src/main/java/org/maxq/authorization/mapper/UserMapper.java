package org.maxq.authorization.mapper;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.MeDto;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

  public Page<GetUserDto> mapToGetUserDtoPage(Page<User> users) {
    Pageable page = users.getPageable();
    List<GetUserDto> userDtoList = users.stream().map(user ->
        new GetUserDto(
            user.getId(),
            user.getEmail(),
            user.isEnabled(),
            roleMapper.mapToRoleDtoList(user.getRoles())
        )
    ).toList();
    return new PageImpl<>(userDtoList, page, users.getTotalElements());
  }

  public MeDto mapToMeDto(User user) {
    return new MeDto(
        user.getEmail(),
        roleMapper.mapToRoleDtoList(user.getRoles())
    );
  }
}
