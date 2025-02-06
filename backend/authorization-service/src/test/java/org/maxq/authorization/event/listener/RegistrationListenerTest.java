package org.maxq.authorization.event.listener;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.service.MailService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.task.SyncTaskExecutor;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;

import java.time.LocalDateTime;
import java.util.concurrent.Executor;

import static org.mockito.Mockito.*;

@SpringBootTest
@Import(AsyncConfig.class)
class RegistrationListenerTest {

  @Autowired
  private RegistrationListener registrationListener;

  @MockBean
  private VerificationTokenService verificationTokenService;
  @MockBean
  private MailService mailService;

  @Test
  void shouldHandleRegistrationEvent() {
    // Given
    User user = new User(1L, "test@test.com", "test", false);
    OnRegistrationComplete event = new OnRegistrationComplete(user);

    VerificationToken token = new VerificationToken(1L, "token", user, LocalDateTime.now());
    when(verificationTokenService.createToken(user)).thenReturn(token);

    // When
    registrationListener.onApplicationEvent(event);

    // Then
    verify(verificationTokenService, times(1)).createToken(any(User.class));
    verify(mailService, times(1)).sendVerificationEmail(token.getToken(), user.getEmail());
  }
}

@Configuration
@EnableAsync
class AsyncConfig implements AsyncConfigurer {
  @Bean
  @Override
  public Executor getAsyncExecutor() {
    return new SyncTaskExecutor();
  }
}