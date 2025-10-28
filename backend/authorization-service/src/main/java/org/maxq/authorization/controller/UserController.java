package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.UserApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.PageDto;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.RoleAlreadyExistsException;
import org.maxq.authorization.domain.exception.RoleDoesNotExistException;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController implements UserApi {

  private final UserService userService;
  private final UserMapper userMapper;

  @Override
  @GetMapping
  public ResponseEntity<PageDto<GetUserDto>> getUsers(
      @RequestParam(required = false, defaultValue = "0") Integer page,
      @RequestParam(required = false, defaultValue = "10") Integer size) {
    Page<User> users = userService.getAllUsers(page, size);
    return ResponseEntity.ok(
        userMapper.mapToGetUserDtoPage(users)
    );
  }

  @Override
  @PatchMapping("/{userId}/addRole")
  public ResponseEntity<Void> addRole(@PathVariable Long userId,
                                      @RequestParam(name = "role") Long roleId
  ) throws ElementNotFoundException, RoleAlreadyExistsException {
    User user = userService.getUserById(userId);
    userService.addRole(user, roleId);
    return ResponseEntity.ok().build();
  }

  @Override
  @PatchMapping("/{userId}/removeRole")
  public ResponseEntity<Void> removeRole(@PathVariable Long userId,
                                         @RequestParam(name = "role") Long roleId
  ) throws ElementNotFoundException, RoleDoesNotExistException {
    User user = userService.getUserById(userId);
    userService.removeRole(user, roleId);
    return ResponseEntity.ok().build();
  }
}
