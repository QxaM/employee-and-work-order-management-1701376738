package org.maxq.authorization.event.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.event.OnRegisterVerificationFail;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class RegisterVerificationListener
    implements ApplicationListener<OnRegisterVerificationFail> {

  private final VerificationTokenService verificationTokenService;
  private final MailService emailService;

  @Override
  public void onApplicationEvent(OnRegisterVerificationFail event) {
    User user = event.getUser();
    VerificationToken savedToken = verificationTokenService.createToken(user);

    log.debug("Token created, sending verification email.");
    emailService.sendVerificationEmail(user.getEmail(), savedToken.getToken());
  }

  @Override
  public boolean supportsAsyncExecution() {
    return true;
  }
}
