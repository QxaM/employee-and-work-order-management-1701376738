package org.maxq.authorization.service.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class MailCreatorService {

  private final TemplateEngine templateEngine;
  @Value("${frontend.url}")
  private String frontendUrl;
  @Value("${frontend.register.confirm.mapping}")
  private String registerConfirmMapping;

  public String buildVerificationEmail(String token, String email) {
    String verificationUrl = frontendUrl + registerConfirmMapping + "?token=" + token;

    Context context = new Context();
    context.setVariable("confirmationUrl", verificationUrl);
    context.setVariable("email", email);

    return templateEngine.process("mail/verification-email", context);
  }
}
