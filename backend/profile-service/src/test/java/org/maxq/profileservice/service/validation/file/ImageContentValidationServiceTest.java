package org.maxq.profileservice.service.validation.file;

import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.ImageFormats;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.ValidationError;
import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.service.image.ImageService;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


@SpringBootTest
class ImageContentValidationServiceTest {

  @MockitoBean
  private ImageService imageService;

  protected static Stream<ImageFormat> validImageFormats() {
    return Stream.of(ImageFormats.JPEG, ImageFormats.PNG);
  }

  protected static Stream<ImageFormat> invalidImageFormats() {
    return Arrays.stream(ImageFormats.values())
        .map(ImageFormat.class::cast)
        .filter(format ->
            validImageFormats()
                .noneMatch(validFormat -> validFormat.equals(format))
        );
  }

  @ParameterizedTest
  @MethodSource("validImageFormats")
  void shouldValidateSignature_When_ValidSignature(ImageFormat imageFormat) throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("content".getBytes(), "image/" + imageFormat.getDefaultExtension());
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(imageFormat);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertDoesNotThrow(executable, "Exception thrown for valid file");
    assertAll(
        () -> assertTrue(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertTrue(validationService.getValidationResult().getMessages().isEmpty(),
            "Validation result should be empty for valid signature")
    );
  }

  @ParameterizedTest
  @MethodSource("invalidImageFormats")
  void shouldValidateSignature_When_InvalidSignature(ImageFormat imageFormat) throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_REAL_FORMAT);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), "image/" + imageFormat.getDefaultExtension());
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(imageFormat);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertThrows(FileValidationException.class, executable,
        "Exception not thrown for invalid file");
    assertAll(
        () -> assertFalse(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertEquals(validationResult.getMessages(), validationService.getValidationResult().getMessages(),
            "Wrong validation result for signature validation")
    );
  }

  @ParameterizedTest
  @ValueSource(strings = {"image/jpg", "image/jpeg"})
  void shouldValidateContentMismatch_When_JpgContentMatch(String contentType) throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("content".getBytes(), contentType);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(ImageFormats.JPEG);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertDoesNotThrow(executable, "Exception thrown for valid file");
    assertAll(
        () -> assertTrue(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertTrue(validationService.getValidationResult().getMessages().isEmpty(),
            "Validation result should be empty for valid signature")
    );
  }

  @ParameterizedTest
  @ValueSource(strings = {"image/png"})
  void shouldValidateContentMismatch_When_PngContentMatch(String contentType) throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("content".getBytes(), contentType);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(ImageFormats.PNG);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertDoesNotThrow(executable, "Exception thrown for valid file");
    assertAll(
        () -> assertTrue(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertTrue(validationService.getValidationResult().getMessages().isEmpty(),
            "Validation result should be empty for valid signature")
    );
  }

  @Test
  void shouldValidateContentMismatch_When_ContentNull() throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_CONTENT_TYPE);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(ImageFormats.JPEG);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertThrows(FileValidationException.class, executable,
        "Exception not thrown for invalid file");
    assertAll(
        () -> assertFalse(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertEquals(validationResult.getMessages(), validationService.getValidationResult().getMessages(),
            "Wrong validation result for signature validation")
    );
  }

  @ParameterizedTest
  @ValueSource(strings = {"image/png", "image/gif", "image/bmp", "text/plain", "unknown"})
  void shouldValidateContentMismatch_When_JpgContentMismatch(String contentType) throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_CONTENT_MISMATCH);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), contentType);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(ImageFormats.JPEG);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertThrows(FileValidationException.class, executable,
        "Exception not thrown for invalid file");
    assertAll(
        () -> assertFalse(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertEquals(validationResult.getMessages(), validationService.getValidationResult().getMessages(),
            "Wrong validation result for signature validation")
    );
  }

  @ParameterizedTest
  @ValueSource(strings = {"image/jpg", "image/jpeg", "image/gif", "image/bmp", "text/plain", "unknown"})
  void shouldValidateContentMismatch_When_PngContentMismatch(String contentType) throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_CONTENT_MISMATCH);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), contentType);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);
    when(imageService.guessFormat(file.getData())).thenReturn(ImageFormats.PNG);

    // When
    Executable executable = () -> validationService.validateSignature().validate();

    // Then
    assertThrows(FileValidationException.class, executable,
        "Exception not thrown for invalid file");
    assertAll(
        () -> assertFalse(validationService.getValidationResult().isValid(),
            "Validation not valid for valid signature"),
        () -> assertEquals(validationResult.getMessages(), validationService.getValidationResult().getMessages(),
            "Wrong validation result for signature validation")
    );
  }
}