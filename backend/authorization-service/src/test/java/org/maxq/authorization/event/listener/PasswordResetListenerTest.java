package org.maxq.authorization.event.listener;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.config.AsyncConfig;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.event.OnPasswordReset;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Import(AsyncConfig.class)
class PasswordResetListenerTest {

  @Autowired
  private PasswordResetListener passwordResetListener;

  @MockBean
  private UserService userService;
  @MockBean
  private VerificationTokenService verificationTokenService;
  @MockBean
  private MailService mailService;

  @Test
  void shouldHandleRegistrationEvent() throws ElementNotFoundException {
    // Given
    User user = new User(1L, "test@test.com", "test", false);
    VerificationToken token = new VerificationToken(1L, "token", user, null);
    OnPasswordReset event = new OnPasswordReset(user.getEmail());

    when(userService.getUserByEmail(user.getEmail())).thenReturn(user);
    when(verificationTokenService.createToken(any(User.class))).thenReturn(token);

    // When
    passwordResetListener.onApplicationEvent(event);

    // Then
    verify(verificationTokenService, times(1)).createToken(any(User.class));
    verify(mailService, times(1)).sendPasswordReset(user.getEmail(), token.getToken());
  }

  @Test
  void shouldNotSend_When_UserServiceException() throws ElementNotFoundException {
    // Given
    when(userService.getUserByEmail(anyString()))
        .thenThrow(new ElementNotFoundException("Test error"));

    // When
    passwordResetListener.onApplicationEvent(new OnPasswordReset("test@test.com"));

    // Then
    verify(mailService, never()).sendPasswordReset(anyString(), anyString());
  }
}