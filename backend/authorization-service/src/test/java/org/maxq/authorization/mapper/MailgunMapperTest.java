package org.maxq.authorization.mapper;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.dto.MailgunDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class MailgunMapperTest {

  @Autowired
  private MailgunMapper mailgunMapper;

  @Test
  void shouldMapToFormParts() {
    // Given
    Map<String, String> variables = Map.of(
        "key-1", "value-1",
        "key-2", "value-2"
    );
    MailgunDto mailgunDto = new MailgunDto(
        "from@test.com",
        "to@test.com",
        "Test Subject",
        "template",
        variables
    );

    // When
    Map<String, String> parts = mailgunMapper.mapToFormParts(mailgunDto);

    // Then
    assertEquals(5, parts.size(), "Parts count not correct");
    assertAll(
        () -> assertEquals(mailgunDto.getFrom(), parts.get("from"),
            "From not mapped correctly"),
        () -> assertEquals(mailgunDto.getTo(), parts.get("to"),
            "To not mapped correctly"),
        () -> assertEquals(mailgunDto.getSubject(), parts.get("subject"),
            "Subject not mapped correctly"),
        () -> assertEquals(mailgunDto.getTemplateName(), parts.get("template"),
            "Template not mapped correctly"),
        () -> assertEquals(
            new Gson().toJson(mailgunDto.getTemplateVariables()),
            parts.get("h:X-Mailgun-Variables"),
            "Template variables not mapped correctly"
        )
    );
  }
}