package org.maxq.authorization.event.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RegistrationListener implements ApplicationListener<OnRegistrationComplete> {

  private final VerificationTokenService verificationTokenService;
  private final MailService emailService;

  @Override
  @Async
  public void onApplicationEvent(OnRegistrationComplete event) {
    User user = event.getUser();
    VerificationToken savedToken = verificationTokenService.createToken(user);

    log.debug("Token created, sending verification email.");
    emailService.sendVerificationEmail(savedToken.getToken(), user.getEmail());
  }

  @Override
  public boolean supportsAsyncExecution() {
    return true;
  }
}
