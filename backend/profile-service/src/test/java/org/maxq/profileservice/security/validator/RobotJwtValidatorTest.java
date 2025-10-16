package org.maxq.profileservice.security.validator;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class RobotJwtValidatorTest {

  private final OAuth2TokenValidator<Jwt> validator = new RobotJwtValidator();

  @Test
  void shouldValidate_When_ValidToken() {
    // Given
    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .subject("robot")
        .issuer("api-gateway-service")
        .claim("type", "access_token")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();

    // When
    OAuth2TokenValidatorResult result = validator.validate(jwt);

    // Then
    assertFalse(result.hasErrors(), "Result should not have errors");
  }

  @Test
  void shouldValidate_When_NoRobot() {
    // Given
    OAuth2Error error = new OAuth2Error("invalid_subject", "Subject must be a 'robot'", null);
    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .subject("test")
        .issuer("api-gateway-service")
        .claim("type", "access_token")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();

    // When
    OAuth2TokenValidatorResult result = validator.validate(jwt);

    // Then
    assertTrue(result.hasErrors(), "Result should have errors");
    assertEquals(1, result.getErrors().size(), "Result should contain only one error");
    OAuth2Error actualError = result.getErrors().stream().toList().getFirst();
    assertAll(
        () -> assertEquals(error.getErrorCode(), actualError.getErrorCode(),
            "Error code should be equal"),
        () -> assertEquals(error.getDescription(), actualError.getDescription(),
            "Error description should be equal")
    );
  }

  @Test
  void shouldValidate_When_EmptyRobot() {
    // Given
    OAuth2Error error = new OAuth2Error("invalid_subject", "Subject must be a 'robot'", null);
    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .issuer("api-gateway-service")
        .claim("type", "access_token")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();

    // When
    OAuth2TokenValidatorResult result = validator.validate(jwt);

    // Then
    assertTrue(result.hasErrors(), "Result should have errors");
    assertEquals(1, result.getErrors().size(), "Result should contain only one error");
    OAuth2Error actualError = result.getErrors().stream().toList().getFirst();
    assertAll(
        () -> assertEquals(error.getErrorCode(), actualError.getErrorCode(),
            "Error code should be equal"),
        () -> assertEquals(error.getDescription(), actualError.getDescription(),
            "Error description should be equal")
    );
  }

  @Test
  void shouldValidate_When_WrongType() {
    // Given
    OAuth2Error error = new OAuth2Error("invalid_type", "Type must be 'access_token'", null);
    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .subject("robot")
        .issuer("api-gateway-service")
        .claim("type", "test_token")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();

    // When
    OAuth2TokenValidatorResult result = validator.validate(jwt);

    // Then
    assertTrue(result.hasErrors(), "Result should have errors");
    assertEquals(1, result.getErrors().size(), "Result should contain only one error");
    OAuth2Error actualError = result.getErrors().stream().toList().getFirst();
    assertAll(
        () -> assertEquals(error.getErrorCode(), actualError.getErrorCode(),
            "Error code should be equal"),
        () -> assertEquals(error.getDescription(), actualError.getDescription(),
            "Error description should be equal")
    );
  }

  @Test
  void shouldValidate_When_NoType() {
    // Given
    OAuth2Error error = new OAuth2Error("invalid_type", "Type must be 'access_token'", null);
    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .subject("robot")
        .issuer("api-gateway-service")
        .claim("test", "access_token")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();

    // When
    OAuth2TokenValidatorResult result = validator.validate(jwt);

    // Then
    assertTrue(result.hasErrors(), "Result should have errors");
    assertEquals(1, result.getErrors().size(), "Result should contain only one error");
    OAuth2Error actualError = result.getErrors().stream().toList().getFirst();
    assertAll(
        () -> assertEquals(error.getErrorCode(), actualError.getErrorCode(),
            "Error code should be equal"),
        () -> assertEquals(error.getDescription(), actualError.getDescription(),
            "Error description should be equal")
    );
  }
}