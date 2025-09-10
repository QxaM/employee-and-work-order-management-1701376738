package org.maxq.profileservice.service.validation.file;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EmptySource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.maxq.profileservice.domain.ValidationError;
import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ImageValidationServiceTest {

  private static final String FILE_VALIDATION_ERROR = "File validation failed!";
  private static final String FILE_CONTENT_TYPE = "image/jpeg";

  private final byte[] content = "test-content".getBytes();
  @Autowired
  private ImageValidationService validationService;

  protected static Stream<String> validImageNames() {
    return Stream.of("test.jpg", "TEST.jpg", "Test12345.jpg");
  }

  protected static Stream<String> invalidImageNames() {
    return Stream.of("te\\%00st.jpg", "test.php.jpg", "..\\test.jpg", "test\\x.jpg", "test",
        "test.", "test..jpg", "test.jpg.", "test.jpg..", "test.jpg.jpg", "test.jpg.jpg.jpg");
  }

  protected static Stream<String> validImageExtensions() {
    return Stream.of("image.jpg", "image.jpeg", "image.png");
  }

  protected static Stream<String> invalidImageExtensions() {
    return Stream.of("image.php", "image.gif", "image.bmp", "image.svg", "test");
  }

  protected static Stream<String> validImageContentType() {
    return Stream.of("image/jpg", "image/jpeg", "image/png");
  }

  protected static Stream<String> invalidImageContentType() {
    return Stream.of("text/php", "image/gif", "image/bmp", "image/svg", "text/plain");
  }

  @ParameterizedTest
  @MethodSource("validImageNames")
  void validateName_When_CorrectFile(String originalFilename) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", originalFilename, FILE_CONTENT_TYPE, content);

    // When + Then
    assertDoesNotThrow(() -> validationService.of(file).validateName().validate(), "Exception thrown for valid file");
  }

  @ParameterizedTest
  @NullAndEmptySource
  @MethodSource("invalidImageNames")
  void validateName_When_IncorrectFile(String originalFilename) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", originalFilename, FILE_CONTENT_TYPE, content);
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_NAME);

    // When
    Executable executable = () -> validationService.of(file).validateName().validate();

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable, "Exception not thrown for invalid file");
    assertAll(
        () -> assertEquals(FILE_VALIDATION_ERROR, exception.getMessage(), "Exception message incorrect"),
        () -> assertEquals(validationResult.isValid(), exception.getValidationResult().isValid(),
            "Validation result incorrect"),
        () -> assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
            "Validation result messages incorrect")
    );
  }

  @ParameterizedTest
  @MethodSource("validImageExtensions")
  void validateExtension_When_ValidExtension(String originalFilename) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", originalFilename, FILE_CONTENT_TYPE, content);

    // When + Then
    assertDoesNotThrow(() -> validationService.of(file).validateExtension().validate(),
        "Exception thrown for valid file");
  }

  @ParameterizedTest
  @NullAndEmptySource
  @MethodSource("invalidImageExtensions")
  void validateExtension_When_InvalidExtension(String originalFilename) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", originalFilename, FILE_CONTENT_TYPE, content);
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_EXTENSION);

    // When
    Executable executable = () -> validationService.of(file).validateExtension().validate();

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable, "Exception not thrown for invalid file");
    assertAll(
        () -> assertEquals(FILE_VALIDATION_ERROR, exception.getMessage(), "Exception message incorrect"),
        () -> assertEquals(validationResult.isValid(), exception.getValidationResult().isValid(),
            "Validation result incorrect"),
        () -> assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
            "Validation result messages incorrect")
    );
  }

  @ParameterizedTest
  @MethodSource("validImageContentType")
  void validateExtension_When_ValidContentType(String contentType) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", "image.png", contentType, content);

    // When + Then
    assertDoesNotThrow(() -> validationService.of(file).validateContentType().validate(),
        "Exception thrown for valid file");
  }

  @ParameterizedTest
  @EmptySource
  @MethodSource("invalidImageContentType")
  void validateExtension_When_InvalidContentType(String contentType) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", "image.png", contentType, content);
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_CONTENT_TYPE);

    // When
    Executable executable = () -> validationService.of(file).validateContentType().validate();

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable, "Exception not thrown for invalid file");
    assertAll(
        () -> assertEquals(FILE_VALIDATION_ERROR, exception.getMessage(), "Exception message incorrect"),
        () -> assertEquals(validationResult.isValid(), exception.getValidationResult().isValid(),
            "Validation result incorrect"),
        () -> assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
            "Validation result messages incorrect")
    );
  }

  @Test
  void validateExtension_When_ValidSize() {
    // Given
    byte[] validContent = new byte[1024 * 1024 * 10];
    MockMultipartFile file = new MockMultipartFile("file", "image.png", FILE_CONTENT_TYPE, validContent);

    // When + Then
    assertDoesNotThrow(() -> validationService.of(file).validateSize().validate(),
        "Exception thrown for valid file");
  }

  @Test
  void validateExtension_When_InvalidSize() {
    // Given
    byte[] invalidContent = new byte[1024 * 1024 * 10 + 1];
    MockMultipartFile file
        = new MockMultipartFile("file", "image.png", FILE_CONTENT_TYPE, invalidContent);
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_SIZE);

    // When
    Executable executable = () -> validationService.of(file).validateSize().validate();

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable, "Exception not thrown for invalid file");
    assertAll(
        () -> assertEquals(FILE_VALIDATION_ERROR, exception.getMessage(), "Exception message incorrect"),
        () -> assertEquals(validationResult.isValid(), exception.getValidationResult().isValid(),
            "Validation result incorrect"),
        () -> assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
            "Validation result messages incorrect")
    );
  }

  @Test
  void shouldReturnMultipleErrors() {
    // Given
    byte[] invalidContent = new byte[1024 * 1024 * 10 + 1];
    MockMultipartFile file
        = new MockMultipartFile("file", "test%00.php", "text/plain", invalidContent);
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_NAME);
    validationResult.addError(ValidationError.FILE_EXTENSION);
    validationResult.addError(ValidationError.FILE_CONTENT_TYPE);
    validationResult.addError(ValidationError.FILE_SIZE);

    // When
    Executable executable =
        () -> validationService.of(file)
            .validateName()
            .validateExtension()
            .validateContentType()
            .validateSize()
            .validate();

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable, "Exception not thrown for invalid file");
    assertAll(
        () -> assertEquals(FILE_VALIDATION_ERROR, exception.getMessage(), "Exception message incorrect"),
        () -> assertEquals(validationResult.isValid(), exception.getValidationResult().isValid(),
            "Validation result incorrect"),
        () -> assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
            "Validation result messages incorrect")
    );
  }
}