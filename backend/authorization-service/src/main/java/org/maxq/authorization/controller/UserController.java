package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.UserApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController implements UserApi {

  private final UserService userService;
  private final UserMapper userMapper;

  @Override
  @GetMapping
  public ResponseEntity<Page<GetUserDto>> getUsers(
      @RequestParam(required = false, defaultValue = "0") Integer page,
      @RequestParam(required = false, defaultValue = "0") Integer size) {
    Page<User> users = userService.getAllUsers(page, size);
    return ResponseEntity.ok(
        userMapper.mapToGetUserDtoPage(users)
    );
  }
}
