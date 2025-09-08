package org.maxq.profileservice.service.validation.file;

import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
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

  private final String contentType = "image/jpeg";
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

  @ParameterizedTest
  @MethodSource("validImageNames")
  void validateName_When_CorrectFile(String originalFilename) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", originalFilename, contentType, content);

    // When
    assertDoesNotThrow(() -> validationService.of(file).validateName().validate(), "Exception thrown for valid file");
  }

  @ParameterizedTest
  @NullAndEmptySource
  @MethodSource("invalidImageNames")
  void validateName_When_IncorrectFile(String originalFilename) {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", originalFilename, contentType, content);
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
}