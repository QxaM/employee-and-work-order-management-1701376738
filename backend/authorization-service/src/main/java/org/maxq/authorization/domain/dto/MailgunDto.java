package org.maxq.authorization.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MailgunDto {

  private String from;
  private String to;
  private String subject;
  private String templateName;
  private Map<String, String> templateVariables;
}
