package org.maxq.authorization.service.mail;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.dto.MailgunDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class MailgunDtoCreatorServiceTest {

  private static final String FROM = "noreply@maxq.com";
  private static final String VERIFICATION_SUBJECT = "MaxQ Work Manager Verification";
  private static final String VERIFICATION_TEMPLATE = "verification email";
  private static final String PASSWORD_RESET_SUBJECT = "MaxQ Work Manager Password Reset";
  private static final String PASSWORD_RESET_TEMPLATE = "reset password email";

  private static final String TOKEN = "token";
  private static final String EMAIL = "test@test.com";

  @Autowired
  private MailgunDtoCreatorService mailgunDtoCreatorService;

  @Test
  void shouldBuildVerificationEmail() {
    // Given

    // When
    MailgunDto actualDto = mailgunDtoCreatorService.buildVerificationEmail(TOKEN, EMAIL);

    // Then
    assertAll(
        () -> assertEquals(FROM, actualDto.getFrom(), "From email is incorrect"),
        () -> assertEquals(EMAIL, actualDto.getTo(), "To email is incorrect"),
        () -> assertEquals(VERIFICATION_SUBJECT, actualDto.getSubject(),
            "Subject is incorrect"),
        () -> assertEquals(VERIFICATION_TEMPLATE, actualDto.getTemplateName(),
            "Template is incorrect"),
        () -> assertEquals(2, actualDto.getTemplateVariables().size(),
            "Template variables is incorrect")
    );
  }

  @Test
  void shouldBuildPasswordResetEmail() {
    // Given

    // When
    MailgunDto actualDto = mailgunDtoCreatorService.buildPasswordResetEmail(TOKEN, EMAIL);

    // Then
    assertAll(
        () -> assertEquals(FROM, actualDto.getFrom(), "From email is incorrect"),
        () -> assertEquals(EMAIL, actualDto.getTo(), "To email is incorrect"),
        () -> assertEquals(PASSWORD_RESET_SUBJECT, actualDto.getSubject(),
            "Subject is incorrect"),
        () -> assertEquals(PASSWORD_RESET_TEMPLATE, actualDto.getTemplateName(),
            "Template is incorrect"),
        () -> assertEquals(2, actualDto.getTemplateVariables().size(),
            "Template variables is incorrect")
    );
  }
}