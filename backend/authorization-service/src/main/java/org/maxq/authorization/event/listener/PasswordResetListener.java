package org.maxq.authorization.event.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.event.OnPasswordReset;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PasswordResetListener implements ApplicationListener<OnPasswordReset> {

  private final UserService userService;
  private final VerificationTokenService verificationTokenService;
  private final MailService emailService;

  @Override
  @Async
  public void onApplicationEvent(OnPasswordReset event) {
    try {
      User user = userService.getUserByEmail(event.getEmail());
      VerificationToken savedToken = verificationTokenService.createToken(user);

      log.debug("Token created, sending password reset email.");
      emailService.sendPasswordReset(user.getEmail(), savedToken.getToken());
    } catch (ElementNotFoundException e) {
      log.error("User with this email does not exist. Email: {}", event.getEmail(), e);
    }
  }

  @Override
  public boolean supportsAsyncExecution() {
    return ApplicationListener.super.supportsAsyncExecution();
  }
}
