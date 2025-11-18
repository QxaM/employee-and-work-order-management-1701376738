package org.maxq.taskservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.taskservice.controller.api.QaApi;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.mapper.UserMapper;
import org.maxq.taskservice.service.UserService;
import org.maxq.taskservice.service.message.handler.CreateUserMessageHandler;
import org.maxq.taskservice.service.message.handler.UpdateUserMessageHandler;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/qa")
@Profile({"QA", "DEV", "SIT"})
@RequiredArgsConstructor
public class QaController implements QaApi {

  private final UserService userService;
  private final UserMapper userMapper;
  private final CreateUserMessageHandler createUserMessageHandler;
  private final UpdateUserMessageHandler updateUserMessageHandler;

  @Override
  @GetMapping("/users/{userId}")
  public ResponseEntity<UserDto> getUser(@PathVariable Long userId)
      throws ElementNotFoundException {
    User foundUser = userService.getUserById(userId);
    UserDto mappedUser = userMapper.mapToUserDto(foundUser);
    return ResponseEntity.ok(mappedUser);
  }

  @Override
  @PostMapping("/users")
  public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
    createUserMessageHandler.handleMessage(userDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  @Override
  @PutMapping("/users")
  public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto) {
    updateUserMessageHandler.handleMessage(userDto);
    return ResponseEntity.ok(userDto);
  }
}
