package org.maxq.authorization.service.mail;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.client.MailgunClient;
import org.maxq.authorization.domain.dto.MailgunDto;
import org.maxq.authorization.mapper.MailgunMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class MailgunEmailServiceTest {

  private static final String EMAIL = "test@test.com";
  private static final String TOKEN = "token";
  private static final Gson GSON = new Gson();

  @Autowired
  private MailgunEmailService mailgunEmailService;

  @MockitoBean
  private MailgunDtoCreatorService mailgunDtoCreatorService;
  @MockitoBean
  private MailgunMapper mailgunMapper;
  @MockitoBean
  private MailgunClient mailgunClient;

  @Test
  void shouldSendPasswordReset() {
    // Given
    Map<String, String> variables = Map.of("email", EMAIL, "resetUrl", TOKEN);
    MailgunDto mailgunDto = new MailgunDto(
        "from@test.com",
        EMAIL,
        "Subject",
        "Template",
        variables
    );
    Map<String, String> parts = Map.of(
        "from", mailgunDto.getFrom(),
        "to", mailgunDto.getTo(),
        "subject", mailgunDto.getSubject(),
        "template", mailgunDto.getTemplateName(),
        "h:X-Mailgun-Variables", GSON.toJson(variables)
    );

    when(mailgunDtoCreatorService.buildPasswordResetEmail(TOKEN, EMAIL)).thenReturn(mailgunDto);
    when(mailgunMapper.mapToFormParts(any(MailgunDto.class))).thenReturn(parts);

    // When
    mailgunEmailService.sendPasswordReset(EMAIL, TOKEN);

    // Then
    assertAll(
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("from").equals(mailgunDto.getFrom()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("to").equals(mailgunDto.getTo()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("subject").equals(mailgunDto.getSubject()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("template").equals(mailgunDto.getTemplateName()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("h:X-Mailgun-Variables").equals(GSON.toJson(variables)))
        )
    );
  }

  @Test
  void shouldSendVerificationEmail() {
    // Given
    Map<String, String> variables = Map.of("email", EMAIL, "confirmationUrl", TOKEN);
    MailgunDto mailgunDto = new MailgunDto(
        "from@test.com",
        EMAIL,
        "Subject",
        "Template",
        variables
    );
    Map<String, String> parts = Map.of(
        "from", mailgunDto.getFrom(),
        "to", mailgunDto.getTo(),
        "subject", mailgunDto.getSubject(),
        "template", mailgunDto.getTemplateName(),
        "h:X-Mailgun-Variables", GSON.toJson(variables)
    );

    when(mailgunDtoCreatorService.buildVerificationEmail(TOKEN, EMAIL)).thenReturn(mailgunDto);
    when(mailgunMapper.mapToFormParts(any(MailgunDto.class))).thenReturn(parts);

    // When
    mailgunEmailService.sendVerificationEmail(EMAIL, TOKEN);

    // Then
    verify(mailgunClient, times(1)).postEmail(anyMap());
    assertAll(
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("from").equals(mailgunDto.getFrom()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("to").equals(mailgunDto.getTo()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("subject").equals(mailgunDto.getSubject()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("template").equals(mailgunDto.getTemplateName()))
        ),
        () -> verify(mailgunClient, times(1)).postEmail(
            argThat(element -> element.get("h:X-Mailgun-Variables").equals(GSON.toJson(variables)))
        )
    );
  }
}