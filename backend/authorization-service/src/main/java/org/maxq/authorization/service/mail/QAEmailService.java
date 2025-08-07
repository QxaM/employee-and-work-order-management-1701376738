package org.maxq.authorization.service.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("QA | SIT")
@Slf4j
public class QAEmailService implements MailService {

  @Override
  public void sendVerificationEmail(String token, String email) {
    log.info("Email Service Stub - sending verification email to {} with token {}", email, token);
  }

  @Override
  public void sendPasswordReset(String email, String token) {
    log.info("Email Service Stub - sending password reset email to {} with token {}", email, token);
  }
}
