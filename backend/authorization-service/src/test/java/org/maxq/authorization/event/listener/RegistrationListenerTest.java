package org.maxq.authorization.event.listener;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.config.AsyncConfig;
import org.maxq.authorization.domain.Profile;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.dto.RoleDto;
import org.maxq.authorization.domain.dto.TaskUserDto;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.event.message.RabbitmqMessage;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.maxq.authorization.service.message.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.*;

@SpringBootTest
@Import(AsyncConfig.class)
class RegistrationListenerTest {

  @Autowired
  private RegistrationListener registrationListener;

  @MockitoBean
  private VerificationTokenService verificationTokenService;
  @MockitoBean
  private MailService templateEmailService;
  @MockitoBean
  private MessageService<RabbitmqMessage<?>> profileMessageService;
  @MockitoBean
  private UserMapper userMapper;
  @MockitoBean
  private MessageService<RabbitmqMessage<?>> taskMessageService;

  @Test
  void shouldHandleRegistrationEvent() {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    Profile profile = new Profile(user.getEmail(), "Test", null, "Test");
    RoleDto roleDto = new RoleDto(role.getId(), role.getName());
    TaskUserDto userDto = new TaskUserDto(user.getId(), user.getEmail(), List.of(roleDto));
    OnRegistrationComplete event = new OnRegistrationComplete(user, profile);

    VerificationToken token = new VerificationToken(1L, "token", user, LocalDateTime.now(), false);
    when(verificationTokenService.createToken(user)).thenReturn(token);
    when(userMapper.mapToTaskUserDto(user)).thenReturn(userDto);

    // When
    registrationListener.onApplicationEvent(event);

    // Then
    assertAll(
        () -> verify(verificationTokenService, times(1)).createToken(any(User.class)),
        () -> verify(templateEmailService, times(1))
            .sendVerificationEmail(user.getEmail(), token.getToken()),
        () -> verify(profileMessageService, times(1))
            .sendMessage(argThat(message -> "profile.create".equals(message.getTopic()))),
        () -> verify(profileMessageService, times(1))
            .sendMessage(any(RabbitmqMessage.class)),
        () -> verify(taskMessageService, times(1))
            .sendMessage(argThat(message -> "user.create".equals(message.getTopic()))),
        () -> verify(taskMessageService, times(1))
            .sendMessage(any(RabbitmqMessage.class))
    );
  }
}

