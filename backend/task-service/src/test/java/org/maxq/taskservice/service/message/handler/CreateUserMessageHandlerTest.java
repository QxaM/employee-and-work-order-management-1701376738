package org.maxq.taskservice.service.message.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.taskservice.domain.Role;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.domain.exception.DuplicateDataException;
import org.maxq.taskservice.mapper.UserMapper;
import org.maxq.taskservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@SpringBootTest
class CreateUserMessageHandlerTest {

  @Autowired
  private CreateUserMessageHandler messageHandler;

  @MockitoBean
  private UserService userService;
  @MockitoBean
  private UserMapper userMapper;

  @Test
  void shouldHandleMessage() throws DuplicateDataException {
    // Given
    RoleDto roleDto = new RoleDto(1L, "ROLE_TEST");
    UserDto userDto = new UserDto(1L, "test@test.com", List.of(roleDto));
    Role role = new Role(roleDto.getId(), roleDto.getName());
    User user = new User(userDto.getId(), userDto.getEmail(), Set.of(role));

    when(userMapper.mapToUser(userDto)).thenReturn(user);
    doNothing().when(userService).createUser(user);

    // When
    Executable executable = () -> messageHandler.handleMessage(userDto);

    // Then
    assertDoesNotThrow(executable);
    verify(userService, times(1)).createUser(user);
  }

  @Test
  void shouldHandleMessage_When_UserServiceThrows() throws DuplicateDataException {
    // Given
    RoleDto roleDto = new RoleDto(1L, "ROLE_TEST");
    UserDto userDto = new UserDto(1L, "test@test.com", List.of(roleDto));
    Role role = new Role(roleDto.getId(), roleDto.getName());
    User user = new User(userDto.getId(), userDto.getEmail(), Set.of(role));

    when(userMapper.mapToUser(userDto)).thenReturn(user);
    doThrow(DuplicateDataException.class).when(userService).createUser(user);

    // When
    Executable executable = () -> messageHandler.handleMessage(userDto);

    // Then
    assertDoesNotThrow(executable);
    verify(userService, times(1)).createUser(user);
  }
}