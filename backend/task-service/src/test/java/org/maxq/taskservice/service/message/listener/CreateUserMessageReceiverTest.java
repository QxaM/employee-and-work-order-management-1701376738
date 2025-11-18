package org.maxq.taskservice.service.message.listener;

import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.service.message.handler.CreateUserMessageHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class CreateUserMessageReceiverTest {

  @Autowired
  private CreateUserMessageReceiver createUserMessageReceiver;

  @MockitoBean
  private CreateUserMessageHandler messageHandler;

  @Test
  void shouldReceiveMessage() {
    // Given
    RoleDto roleDto = new RoleDto(1L, "ROLE_TEST");
    UserDto userDto = new UserDto(1L, "test@test.com", List.of(roleDto));

    // When
    createUserMessageReceiver.receiveCreateMessage(userDto);

    // Then
    assertAll(
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(user -> userDto.getId().equals(user.getId()))
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(user -> userDto.getEmail().equals(user.getEmail()))
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(user -> userDto.getRoles().size() == user.getRoles().size())
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(user -> userDto.getRoles()
                .getFirst()
                .getId()
                .equals(user.getRoles().getFirst().getId()))
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(user -> userDto.getRoles()
                .getFirst()
                .getName()
                .equals(user.getRoles().getFirst().getName()))
        )
    );
  }
}