package com.qxam.workmanagement.domain.validator;

import static org.junit.jupiter.api.Assertions.*;

import com.qxam.workmanagement.domain.dto.UserDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PasswordConstraintValidatorTests {

  private static final String PASSWORD_TOO_SHORT =
      "Password must be 8 or more characters in length.";

  private static final String PASSWORD_TOO_LONG =
      "Password must be no more than 30 characters in length.";

  private static final String PASSWORD_NEEDS_UPPERCASE =
      "Password must contain 1 or more uppercase characters.";

  private static final String PASSWORD_NEEDS_LOWERCASE =
      "Password must contain 1 or more lowercase characters.";

  private static final String PASSWORD_NEEDS_NUMBER =
      "Password must contain 1 or more digit characters.";

  private static final String PASSWORD_NEED_SPECIAL =
      "Password must contain 1 or more special characters.";
  private static final String PASSWORD_CONTAINS_WHITESPACE =
      "Password contains a whitespace character.";
  private static final String PASSWORD_CONTAINS_ALPHABETIC_SEQUENCE =
      "Password contains the illegal alphabetical sequence 'abcd'.";
  private static final String PASSWORD_CONTAINS_NUMERIC_SEQUENCE =
      "Password contains the illegal numerical sequence '0123'.";
  private static final Object PASSWORD_CONTAINS_QWERTY_SEQUENCE =
      "Password contains the illegal QWERTY sequence 'qwer'.";

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

  @ParameterizedTest
  @MethodSource("provideInvalidPasswords")
  void invalidPasswords(String password, String expectedMessage) {
    // Given
    UserDto user =
        UserDto.builder()
            .id(new ObjectId())
            .email("example@example.com")
            .password(password)
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
    assertEquals(expectedMessage, message);
  }

  private static Stream<Arguments> provideInvalidPasswords() {
    return Stream.of(
        Arguments.of("rT1@xyu", PASSWORD_TOO_SHORT),
        Arguments.of("rT1@xyurT1@xyurT1@xyurT1@xyurT1@xyu", PASSWORD_TOO_LONG),
        Arguments.of("rt1@xyug", PASSWORD_NEEDS_UPPERCASE),
        Arguments.of("RT1@XYUG", PASSWORD_NEEDS_LOWERCASE),
        Arguments.of("rTi@xyug", PASSWORD_NEEDS_NUMBER),
        Arguments.of("rT1axyug", PASSWORD_NEED_SPECIAL),
        Arguments.of("rT1@xyug ", PASSWORD_CONTAINS_WHITESPACE),
        Arguments.of("abcdT1@xyug", PASSWORD_CONTAINS_ALPHABETIC_SEQUENCE),
        Arguments.of("rT1@xyug0123", PASSWORD_CONTAINS_NUMERIC_SEQUENCE),
        Arguments.of("rT1@xyugqwer", PASSWORD_CONTAINS_QWERTY_SEQUENCE));
  }
}
