package org.maxq.authorization.service.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@Profile("!QA")
public class TemplateEmailService implements MailService {

  private static final String SENDER = "noreply@maxq.com";
  private static final String VERIFICATION_SUBJECT = "MaxQ Work Manager Verification";
  private static final String PASSWORD_RESET_SUBJECT = "MaxQ Work Manager Password Reset";

  private final JavaMailSender javaMailSender;
  private final MailCreatorService mailCreatorService;

  @Override
  public void sendVerificationEmail(String token, String email) {
    String message = mailCreatorService.buildVerificationEmail(token, email);
    javaMailSender.send(
        createMimeMessage(message, email, VERIFICATION_SUBJECT)
    );
  }

  @Override
  public void sendPasswordReset(String email, String token) {
    String message = mailCreatorService.buildPasswordResetEmail(token, email);
    javaMailSender.send(
        createMimeMessage(message, email, PASSWORD_RESET_SUBJECT)
    );
  }

  private MimeMessagePreparator createMimeMessage(
      String htmlMessage, String email, String subject) {
    return mimeMessage -> {
      MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
      mimeMessageHelper.setFrom(SENDER);
      mimeMessageHelper.setTo(email);
      mimeMessageHelper.setSubject(subject);
      mimeMessageHelper.setText(htmlMessage, true);
    };
  }
}
