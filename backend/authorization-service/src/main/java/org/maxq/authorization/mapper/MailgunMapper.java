package org.maxq.authorization.mapper;

import com.google.gson.Gson;
import org.maxq.authorization.domain.dto.MailgunDto;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MailgunMapper {

  private static final String VARIABLES_PART = "h:X-Mailgun-Variables";

  private final Gson gson = new Gson();

  public Map<String, String> mapToFormParts(MailgunDto mailgunDto) {
    return Map.of(
        "from", mailgunDto.getFrom(),
        "to", mailgunDto.getTo(),
        "subject", mailgunDto.getSubject(),
        "template", mailgunDto.getTemplateName(),
        VARIABLES_PART, gson.toJson(mailgunDto.getTemplateVariables())
    );
  }
}
