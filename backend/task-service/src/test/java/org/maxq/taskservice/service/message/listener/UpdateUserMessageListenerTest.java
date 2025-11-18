package org.maxq.taskservice.service.message.listener;

import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.service.message.handler.UpdateUserMessageHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class UpdateUserMessageListenerTest {

  @Autowired
  private UpdateUserMessageListener updateUserMessageListener;

  @MockitoBean
  private UpdateUserMessageHandler messageHandler;

  @Test
  void shouldReceiveUpdateMessage() {
    // Given
    RoleDto role = new RoleDto(1L, "ROLE_TEST");
    UserDto user = new UserDto(1L, "test@test.com", List.of(role));

    // When
    updateUserMessageListener.receiveUpdateMessage(user);

    // Then
    assertAll(
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(userDto -> user.getId().equals(userDto.getId()))
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(userDto -> user.getEmail().equals(userDto.getEmail()))
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(userDto -> user.getRoles().size() == userDto.getRoles().size())
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(userDto -> user.getRoles()
                .getFirst()
                .getId()
                .equals(userDto.getRoles().getFirst().getId()))
        ),
        () -> verify(messageHandler, times(1)).handleMessage(
            argThat(userDto -> user.getRoles()
                .getFirst()
                .getName()
                .equals(userDto.getRoles().getFirst().getName()))
        )
    );
  }
}