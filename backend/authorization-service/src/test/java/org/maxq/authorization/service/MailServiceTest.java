package org.maxq.authorization.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class MailServiceTest {

  @Autowired
  private MailService mailService;

  @MockBean
  private JavaMailSender mailSender;

  @Test
  void shouldSendEmail() {
    // Given
    doNothing().when(mailSender).send(any(MimeMessagePreparator.class));

    // When
    mailService.sendVerificationEmail("token", "test@test.com");

    // Then
    verify(mailSender, times(1)).send(any(MimeMessagePreparator.class));
  }
}