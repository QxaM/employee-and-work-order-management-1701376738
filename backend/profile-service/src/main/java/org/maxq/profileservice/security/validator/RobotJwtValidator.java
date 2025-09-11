package org.maxq.profileservice.security.validator;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;

public class RobotJwtValidator implements OAuth2TokenValidator<Jwt> {

  @Override
  public OAuth2TokenValidatorResult validate(Jwt token) {
    List<OAuth2Error> errors = new ArrayList<>();

    if (!"robot".equals(token.getSubject())) {
      errors.add(new OAuth2Error("invalid_subject", "Subject must be a 'robot'", null));
    }

    if (!"access_token".equals(token.getClaimAsString("type"))) {
      errors.add(new OAuth2Error("invalid_type", "Type must be 'access_token'", null));
    }

    return errors.isEmpty()
        ? OAuth2TokenValidatorResult.success()
        : OAuth2TokenValidatorResult.failure(errors.toArray(new OAuth2Error[0]));
  }
}
