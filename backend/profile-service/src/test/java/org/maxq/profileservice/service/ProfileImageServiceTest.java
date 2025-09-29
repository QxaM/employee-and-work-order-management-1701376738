package org.maxq.profileservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.ProfileImage;
import org.maxq.profileservice.domain.ValidationError;
import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.service.image.upload.ImageUploadService;
import org.maxq.profileservice.service.validation.ValidationServiceFactory;
import org.maxq.profileservice.service.validation.file.ImageContentValidationService;
import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class ProfileImageServiceTest {

  private final MockMultipartFile mockMultipartFile
      = new MockMultipartFile("file", "image.jpeg", "image/jpeg", "test-content".getBytes());

  @Autowired
  private ProfileImageService service;

  @MockitoBean
  private ValidationServiceFactory validationFactory;
  @MockitoBean
  private ImageUploadService uploadService;

  @Mock
  private ImageValidationService validationService;
  @Mock
  private ImageContentValidationService contentValidationService;

  @BeforeEach
  void setUp() throws IOException {
    when(validationFactory.createImageValidationService(any(MultipartFile.class)))
        .thenReturn(validationService);
    when(validationFactory.createImageContentValidationService(any(InMemoryFile.class)))
        .thenReturn(contentValidationService);

    when(validationService.validateName()).thenReturn(validationService);
    when(validationService.validateExtension()).thenReturn(validationService);
    when(validationService.validateContentType()).thenReturn(validationService);
    when(validationService.validateSize()).thenReturn(validationService);

    when(contentValidationService.validateSignature()).thenReturn(contentValidationService);
    when(contentValidationService.validateRealContent()).thenReturn(contentValidationService);
    when(contentValidationService.validateMetadata()).thenReturn(contentValidationService);
  }

  @Test
  void shouldNotThrow_When_ValidationSuccessful() throws Exception {
    // Given
    doNothing().when(validationService).validate();
    doNothing().when(contentValidationService).validate();

    // When
    Executable executable = () -> service.validateAndReturnImage(mockMultipartFile);

    // Then
    assertDoesNotThrow(executable, "Should throw exception when failed validation");
    assertAll(
        () -> verify(validationService, times(1)).validateName(),
        () -> verify(validationService, times(1)).validateExtension(),
        () -> verify(validationService, times(1)).validateContentType(),
        () -> verify(validationService, times(1)).validateSize(),
        () -> verify(validationService, times(1)).validate()
    );
    assertAll(
        () -> verify(contentValidationService, times(1)).validateSignature(),
        () -> verify(contentValidationService, times(1)).validateRealContent(),
        () -> verify(contentValidationService, times(1)).validateMetadata(),
        () -> verify(contentValidationService, times(1)).validate()
    );
  }

  @Test
  void shouldThrow_When_ValidationFailed() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_NAME;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);

    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When
    Executable executable = () -> service.validateAndReturnImage(mockMultipartFile);

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable,
        "Should throw exception when failed validation");
    assertFalse(exception.getValidationResult().isValid(), "Validation result should be invalid");
    assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
        "Wrong validation result");
    assertAll(
        () -> verify(validationService, times(1)).validateName(),
        () -> verify(validationService, times(1)).validateExtension(),
        () -> verify(validationService, times(1)).validateContentType(),
        () -> verify(validationService, times(1)).validateSize(),
        () -> verify(validationService, times(1)).validate()
    );
  }

  @Test
  void shouldThrow_When_MultipleValidationsFailed() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError fileNameError = ValidationError.FILE_NAME;
    ValidationError fileExtensionError = ValidationError.FILE_EXTENSION;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(fileNameError);
    validationResult.addError(fileExtensionError);

    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When
    Executable executable = () -> service.validateAndReturnImage(mockMultipartFile);

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable,
        "Should throw exception when failed validation");
    assertFalse(exception.getValidationResult().isValid(), "Validation result should be invalid");
    assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
        "Wrong validation result");
    assertAll(
        () -> verify(validationService, times(1)).validateName(),
        () -> verify(validationService, times(1)).validateExtension(),
        () -> verify(validationService, times(1)).validateContentType(),
        () -> verify(validationService, times(1)).validateSize(),
        () -> verify(validationService, times(1)).validate()
    );
  }

  @Test
  void shouldThrow_When_ContentValidationFailed() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_REAL_FORMAT;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);

    doThrow(new FileValidationException(testError, validationResult))
        .when(contentValidationService).validate();

    // When
    Executable executable = () -> service.validateAndReturnImage(mockMultipartFile);

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable,
        "Should throw exception when failed validation");
    assertFalse(exception.getValidationResult().isValid(), "Validation result should be invalid");
    assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
        "Wrong validation result");
    assertAll(

        () -> verify(contentValidationService, times(1)).validateSignature(),
        () -> verify(contentValidationService, times(1)).validateRealContent(),
        () -> verify(contentValidationService, times(1)).validateMetadata(),
        () -> verify(contentValidationService, times(1)).validate()
    );
  }

  @Test
  void shouldThrow_When_MultipleContentValidationsFailed() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError fileRealFormat = ValidationError.FILE_REAL_FORMAT;
    ValidationError fileContentType = ValidationError.FILE_CONTENT_TYPE;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(fileRealFormat);
    validationResult.addError(fileContentType);

    doThrow(new FileValidationException(testError, validationResult)).when(contentValidationService).validate();

    // When
    Executable executable = () -> service.validateAndReturnImage(mockMultipartFile);

    // Then
    FileValidationException exception = assertThrows(FileValidationException.class, executable,
        "Should throw exception when failed validation");
    assertFalse(exception.getValidationResult().isValid(), "Validation result should be invalid");
    assertEquals(validationResult.getMessages(), exception.getValidationResult().getMessages(),
        "Wrong validation result");
    assertAll(
        () -> verify(contentValidationService, times(1)).validateSignature(),
        () -> verify(contentValidationService, times(1)).validateRealContent(),
        () -> verify(contentValidationService, times(1)).validateMetadata(),
        () -> verify(contentValidationService, times(1)).validate()
    );
  }

  @Test
  void shouldReturnProfileImageFromStorage() throws BucketOperationException, IOException {
    // Given
    String imageName = "test.jpeg";
    byte[] data = "test-data".getBytes();
    ProfileImage profileImage = new ProfileImage(imageName, "image/jpeg", data.length);
    BucketOperationResponse response = new BucketOperationResponse(
        true, 200, data
    );
    when(uploadService.getImage(imageName)).thenReturn(response);

    // When
    Resource returnedResource = service.getProfileImageFromStorage(profileImage);

    // Then
    assertArrayEquals(data, returnedResource.getContentAsByteArray(),
        "Correct content should be returned");
  }

  @Test
  void shouldThrow_When_GetImage_When_BucketOperationFailed() throws BucketOperationException {
    // Given
    String imageName = "test.jpeg";
    byte[] data = "test-data".getBytes();
    ProfileImage profileImage = new ProfileImage(imageName, "image/jpeg", data.length);
    doThrow(BucketOperationException.class).when(uploadService).getImage(imageName);

    // When
    Executable executable = () -> service.getProfileImageFromStorage(profileImage);

    // Then
    assertThrows(BucketOperationException.class, executable, "Exception should be thrown");
  }
}