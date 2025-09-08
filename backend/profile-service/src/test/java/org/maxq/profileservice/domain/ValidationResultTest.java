package org.maxq.profileservice.domain;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ValidationResultTest {

  @Test
  void shouldAddError() {
    // Given
    ValidationResult result = new ValidationResult();

    // When
    result.addError(ValidationError.FILE_NAME);

    // Then
    assertFalse(result.isValid(), "ValidationResult should be invalid after adding error");
    assertEquals(1, result.getMessages().size(), "ValidationResult should have one error");
    assertTrue(result.getMessages().contains(ValidationError.FILE_NAME));
  }

  @Test
  void shouldClearErrors() {
    //Given
    ValidationResult result = new ValidationResult();
    result.addError(ValidationError.FILE_NAME);

    // When
    result.clear();

    // Then
    assertTrue(result.isValid(), "ValidationResult should be valid after clearing errors");
    assertTrue(result.getMessages().isEmpty(),
        "ValidationResult should have no errors after clearing errors");
  }
}