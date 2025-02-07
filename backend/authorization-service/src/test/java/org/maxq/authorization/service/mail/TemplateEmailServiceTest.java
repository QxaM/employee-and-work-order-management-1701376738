package org.maxq.authorization.service.mail;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.test.context.ActiveProfiles;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("DEV")
class TemplateEmailServiceTest {

  @Autowired
  private TemplateEmailService templateEmailService;

  @MockBean
  private JavaMailSender mailSender;

  @Test
  void shouldSendEmail() {
    // Given
    doNothing().when(mailSender).send(any(MimeMessagePreparator.class));

    // When
    templateEmailService.sendVerificationEmail("token", "test@test.com");

    // Then
    verify(mailSender, times(1)).send(any(MimeMessagePreparator.class));
  }

  @Test
  void shouldSendPasswordResetEmail() {
    // Given
    doNothing().when(mailSender).send(any(MimeMessagePreparator.class));

    // When
    templateEmailService.sendPasswordReset("token", "test@test.com");

    // Then
    verify(mailSender, times(1)).send(any(MimeMessagePreparator.class));
  }
}