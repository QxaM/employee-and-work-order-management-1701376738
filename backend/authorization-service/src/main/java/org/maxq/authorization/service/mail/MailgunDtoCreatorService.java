package org.maxq.authorization.service.mail;

import org.maxq.authorization.domain.dto.MailgunDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MailgunDtoCreatorService {

  private static final String VERIFICATION_TEMPLATE = "verification email";
  private static final String PASSWORD_RESET_TEMPLATE = "reset password email";

  private static final String SENDER = "noreply@maxq.com";
  private static final String VERIFICATION_SUBJECT = "MaxQ Work Manager Verification";
  private static final String PASSWORD_RESET_SUBJECT = "MaxQ Work Manager Password Reset";

  @Value("${frontend.url}")
  private String frontendUrl;
  @Value("${frontend.register.confirm.mapping}")
  private String registerConfirmMapping;
  @Value("${frontend.reset.password.mapping}")
  private String resetPasswordMapping;


  public MailgunDto buildVerificationEmail(String token, String email) {
    String verificationUrl = frontendUrl + registerConfirmMapping + "?token=" + token;
    Map<String, String> templateVariables = Map.of(
        "email", email,
        "confirmationUrl", verificationUrl
    );

    return new MailgunDto(
        SENDER,
        email,
        VERIFICATION_SUBJECT,
        VERIFICATION_TEMPLATE,
        templateVariables);
  }

  public MailgunDto buildPasswordResetEmail(String token, String email) {
    String resetPasswordUrl = frontendUrl + resetPasswordMapping + "?token=" + token;
    Map<String, String> templateVariables = Map.of(
        "email", email,
        "resetUrl", resetPasswordUrl
    );

    return new MailgunDto(
        SENDER,
        email,
        PASSWORD_RESET_SUBJECT,
        PASSWORD_RESET_TEMPLATE,
        templateVariables
    );
  }
}
