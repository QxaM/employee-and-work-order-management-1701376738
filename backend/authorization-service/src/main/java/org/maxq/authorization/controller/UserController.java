package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.UserApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController implements UserApi {

  private final UserService userService;
  private final UserMapper userMapper;

  @Override
  @GetMapping
  public List<GetUserDto> getUsers() {
    List<User> users = userService.getAllUsers();
    return userMapper.mapToGetUserDtoList(users);
  }
}
