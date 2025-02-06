package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

  private static final String SENDER = "noreply@maxq.com";

  private final JavaMailSender javaMailSender;

  public void sendVerificationEmail(String token) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(SENDER);
    message.setTo("pgliszczu@gmail.com");
    message.setSubject("Verification email");
    message.setText(token);
    javaMailSender.send(
        message
    );
  }
}
