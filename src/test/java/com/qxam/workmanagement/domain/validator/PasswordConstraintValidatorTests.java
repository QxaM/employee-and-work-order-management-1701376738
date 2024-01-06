package com.qxam.workmanagement.domain.validator;

import static org.junit.jupiter.api.Assertions.*;

import com.qxam.workmanagement.domain.dto.UserDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Optional;
import java.util.Set;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PasswordConstraintValidatorTests {

  private static final String PASSWORD_TOO_SHORT =
      "Password must be 8 or more characters in " + "length.";

  private static ValidatorFactory validatorFactory;
  private static Validator validator;

  @BeforeAll
  public static void createValidator() {
    validatorFactory = Validation.buildDefaultValidatorFactory();
    validator = validatorFactory.getValidator();
  }

  @AfterAll
  public static void closeValidator() {
    validatorFactory.close();
  }

  @Test
  void shouldValidate() {
    // Given
    UserDto user =
        UserDto.builder()
            .id(new ObjectId())
            .email("example@example.com")
            .password("rT1@xyug")
            .build();

    // When
    Set<ConstraintViolation<UserDto>> violations = validator.validate(user);

    // Then
    assertTrue(violations.isEmpty());
  }

  @Test
  void invalid_tooShort() {
    // Given
    UserDto user =
        UserDto.builder()
            .id(new ObjectId())
            .email("example@example.com")
            .password("rT1@xyu")
            .build();

    // When
    Set<ConstraintViolation<UserDto>> violations = validator.validate(user);

    String message = "";
    Optional<ConstraintViolation<UserDto>> violation = violations.stream().findFirst();

    if (violation.isPresent()) {
      message = violation.get().getMessage();
    }

    // Then
    assertEquals(1, violations.size());
    assertEquals(PASSWORD_TOO_SHORT, message);
  }
}
