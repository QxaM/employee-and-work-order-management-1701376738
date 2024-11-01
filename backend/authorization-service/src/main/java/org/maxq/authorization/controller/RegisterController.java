package org.maxq.authorization.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegisterController {

  private final UserService userService;
  private final UserMapper userMapper;

  @PostMapping
  public ResponseEntity<Void> register(@RequestBody @Valid UserDto userDto)
      throws DataValidationException, DuplicateEmailException {
    User user = userMapper.mapToUser(userDto);
    userService.createUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}
