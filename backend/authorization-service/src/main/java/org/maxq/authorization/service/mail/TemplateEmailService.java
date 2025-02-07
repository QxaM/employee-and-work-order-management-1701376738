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

  private final JavaMailSender javaMailSender;
  private final MailCreatorService mailCreatorService;

  @Override
  public void sendVerificationEmail(String token, String email) {
    String message = mailCreatorService.buildVerificationEmail(token, email);
    javaMailSender.send(
        createMimeMessage(message, email)
    );
  }

  private MimeMessagePreparator createMimeMessage(String htmlMessage, String email) {
    return mimeMessage -> {
      MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
      mimeMessageHelper.setFrom(SENDER);
      mimeMessageHelper.setTo(email);
      mimeMessageHelper.setSubject("MaxQ Work Manager Verification");
      mimeMessageHelper.setText(htmlMessage, true);
    };
  }
}
