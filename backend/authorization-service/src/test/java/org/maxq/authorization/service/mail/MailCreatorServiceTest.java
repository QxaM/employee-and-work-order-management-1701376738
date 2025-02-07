package org.maxq.authorization.service.mail;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
class MailCreatorServiceTest {

  @InjectMocks
  private MailCreatorService mailCreatorService;

  @Mock
  private TemplateEngine templateEngine;

  @Test
  void shouldBuildVerificationEmail_When_CorrectInputIsGiven() {
    // Given
    String token = "test-token";
    String email = "test@example.com";
    String emailContent = "Email Content";

    when(templateEngine.process(eq("mail/verification-email"), any(Context.class)))
        .thenReturn(emailContent);

    // When
    String convertedContent = mailCreatorService.buildVerificationEmail(token, email);

    // Then
    assertEquals(emailContent, convertedContent, "Template processing should give correct output!");
    verify(templateEngine, times(1)).process(eq("mail/verification-email"), any(Context.class));
  }
}