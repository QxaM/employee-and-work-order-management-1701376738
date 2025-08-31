package org.maxq.authorization.event.listener;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.config.AsyncConfig;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.event.OnRegisterVerificationFail;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Import(AsyncConfig.class)
class RegisterVerificationListenerTest {

  @Autowired
  private RegisterVerificationListener registerVerificationListener;

  @MockitoBean
  private VerificationTokenService verificationTokenService;
  @MockitoBean
  private MailService mailService;

  @Test
  void shouldHandleRegistrationVerificationFailureEvent() {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    OnRegisterVerificationFail event = new OnRegisterVerificationFail(user);

    VerificationToken token = new VerificationToken(1L, "token", user, LocalDateTime.now(), false);
    when(verificationTokenService.createToken(user)).thenReturn(token);

    // When
    registerVerificationListener.onApplicationEvent(event);

    // Then
    verify(verificationTokenService, times(1)).createToken(any(User.class));
    verify(mailService, times(1)).sendVerificationEmail(token.getToken(), user.getEmail());
  }
}
