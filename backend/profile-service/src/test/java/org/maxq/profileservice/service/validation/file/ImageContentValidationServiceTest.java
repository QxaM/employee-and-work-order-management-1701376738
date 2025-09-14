package org.maxq.profileservice.service.validation.file;

import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.ImageFormats;
import org.apache.commons.imaging.ImageInfo;
import org.apache.commons.imaging.ImagingException;
import org.apache.commons.imaging.bytesource.ByteSource;
import org.apache.commons.imaging.formats.jpeg.JpegImageParser;
import org.apache.commons.imaging.formats.png.PngImageParser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.maxq.profileservice.domain.*;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@SpringBootTest
class ImageContentValidationServiceTest {

  private static final ImageInfo IMAGE_INFO = new ImageInfo(
      "Format details",
      1,
      Collections.emptyList(),
      ImageFormats.JPEG,
      "JPEG",
      100,
      "image/jpeg",
      1,
      100,
      100.0f,
      100,
      100.0f,
      100,
      false,
      false,
      false,
      ImageInfo.ColorType.RGB,
      ImageInfo.CompressionAlgorithm.JPEG
  );

  @MockitoBean
  private ApacheImageService imageService;

  @Mock
  private JpegImageParser imageParser;

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

  protected static Stream<Map<String, ImageSize>> invalidImageSizes() {
    String size = "size";
    String metaSize = "metaSize";
    int validSize = 8 * 1024;
    int invalidSize = 8 * 1024 + 1;

    return Stream.of(
        Map.of(
            size, new ImageSize(invalidSize, validSize),
            metaSize, new ImageSize(validSize, validSize)
        ),
        Map.of(
            size, new ImageSize(validSize, invalidSize),
            metaSize, new ImageSize(validSize, validSize)
        ),
        Map.of(
            size, new ImageSize(validSize, validSize),
            metaSize, new ImageSize(invalidSize, validSize)
        ),
        Map.of(
            size, new ImageSize(validSize, validSize),
            metaSize, new ImageSize(validSize, invalidSize)
        )
    );
  }

  @BeforeEach
  void setUp() {
    when(imageService.getParsers()).thenReturn(List.of(imageParser));
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

  @Test
  void shouldValidateRealContent_When_ValidContent() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    BufferedImage bufferedImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);

    when(imageParser.getImageInfo(any(ByteSource.class))).thenReturn(IMAGE_INFO);
    when(imageParser.getBufferedImage(any(ByteSource.class), any())).thenReturn(bufferedImage);

    // When
    Executable executable = () -> validationService.validateRealContent().validate();

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
  void shouldValidateRealContent_When_MultipleParsers() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    BufferedImage bufferedImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);

    PngImageParser pngImageParser = mock(PngImageParser.class);
    when(imageService.getParsers()).thenReturn(Arrays.asList(pngImageParser, imageParser));
    when(imageParser.getImageInfo(any(ByteSource.class))).thenReturn(IMAGE_INFO);
    when(imageParser.getBufferedImage(any(ByteSource.class), any())).thenReturn(bufferedImage);
    when(pngImageParser.getImageInfo(any(ByteSource.class))).thenReturn(null);

    // When
    Executable executable = () -> validationService.validateRealContent().validate();

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
  void shouldValidateRealContent_When_NullImage() throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_REAL_FORMAT);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    when(imageParser.getImageInfo(any(ByteSource.class))).thenReturn(IMAGE_INFO);
    when(imageParser.getBufferedImage(any(ByteSource.class), any())).thenReturn(null);

    // When
    Executable executable = () -> validationService.validateRealContent().validate();

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

  @Test
  void shouldValidateRealContent_When_GetImageThrows() throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_REAL_FORMAT);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    when(imageParser.getImageInfo(any(ByteSource.class))).thenReturn(IMAGE_INFO);
    doThrow(ImagingException.class).when(imageParser).getBufferedImage(any(ByteSource.class), any());

    // When
    Executable executable = () -> validationService.validateRealContent().validate();

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

  @Test
  void shouldValidateRealContent_When_NullImageInfo() throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_REAL_FORMAT);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    when(imageParser.getImageInfo(any(ByteSource.class))).thenReturn(null);

    // When
    Executable executable = () -> validationService.validateRealContent().validate();

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

  @Test
  void shouldValidateRealContent_When_GetImageInfoThrows() throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.FILE_REAL_FORMAT);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    doThrow(ImagingException.class).when(imageParser).getImageInfo(any(ByteSource.class));

    // When
    Executable executable = () -> validationService.validateRealContent().validate();

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

  @Test
  void shouldValidateMetadata_When_ValidMetadata() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    ImageMetadata metadata = new ImageMetadata(
        new ImageSize(8 * 1024, 8 * 1024),
        new ImageSize(8 * 1024, 8 * 1024)
    );
    when(imageService.getMetadata(file.getData())).thenReturn(metadata);

    // When
    Executable executable = () -> validationService.validateMetadata().validate();

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
  @MethodSource("invalidImageSizes")
  void shouldValidateMetadata_When_InvalidDimensions(Map<String, ImageSize> imageSizeMap) throws IOException {
    // Given
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(ValidationError.IMAGE_SIZE);

    InMemoryFile file = InMemoryFile.create("content".getBytes(), null);
    ContentValidationService validationService = new ImageContentValidationService(file, imageService);

    ImageMetadata metadata = new ImageMetadata(
        imageSizeMap.get("size"),
        imageSizeMap.get("metaSize")
    );
    when(imageService.getMetadata(file.getData())).thenReturn(metadata);

    // When
    Executable executable = () -> validationService.validateMetadata().validate();

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