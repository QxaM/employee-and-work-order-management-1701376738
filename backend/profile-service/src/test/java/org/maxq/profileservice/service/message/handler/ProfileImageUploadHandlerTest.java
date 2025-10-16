package org.maxq.profileservice.service.message.handler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.ProfileImage;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.ImageProcessingException;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.maxq.profileservice.service.image.processor.ApacheImageProcessor;
import org.maxq.profileservice.service.image.processor.ApacheImageRandomizer;
import org.maxq.profileservice.service.image.upload.ImageUploadService;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.awt.image.BufferedImage;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ProfileImageUploadHandlerTest {

  @Autowired
  private ProfileImageUploadHandler handler;

  @MockitoBean
  private InMemoryFileMapper inMemoryFileMapper;
  @MockitoBean
  private ApacheImageService imageService;
  @MockitoBean
  private ApacheImageProcessor imageProcessor;
  @MockitoBean
  private ApacheImageRandomizer imageRandomizer;
  @MockitoBean
  private ImageUploadService imageUploadService;
  @MockitoBean
  private ProfileService profileService;

  @Mock
  private BufferedImage mockImage;

  @Autowired
  private ProfileImageUploadHandler profileImageUploadHandler;

  private ProfileImageUploadHandler spyHandler;

  @BeforeEach
  void setUp() {
    spyHandler = spy(profileImageUploadHandler);
    when(mockImage.getWidth()).thenReturn(1024);
    when(mockImage.getHeight()).thenReturn(1024);
  }

  @Test
  void shouldHandleMessage_When_Success() throws ElementNotFoundException, ImageProcessingException, BucketOperationException {
    // Given
    String email = "test@test.com";
    ImageDto imageDto = new ImageDto(email, "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );

    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    doReturn(file).when(spyHandler).processImage(file);
    doNothing().when(spyHandler).uploadImageToStorage(file);
    doNothing().when(spyHandler).updateAndCleanupProfileImage(email, file);

    // When
    spyHandler.handleMessage(imageDto);

    // Then
    assertAll(
        () ->
            verify(spyHandler, times(1)).processImage(file),
        () ->
            verify(spyHandler, times(1)).uploadImageToStorage(file),
        () ->
            verify(spyHandler, times(1)).updateAndCleanupProfileImage(email, file)
    );
  }

  @Test
  void shouldHandleMessage_When_ProcessingFailed() throws ImageProcessingException {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    doThrow(ImageProcessingException.class).when(spyHandler).processImage(file);

    // When + Then
    Executable executable = () -> spyHandler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(spyHandler, times(1)).processImage(file);
  }

  @Test
  void shouldHandleMessage_When_UploadFailed() throws ImageProcessingException, BucketOperationException {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    doReturn(file).when(spyHandler).processImage(file);
    doThrow(BucketOperationException.class).when(spyHandler).uploadImageToStorage(file);

    // When + Then
    Executable executable = () -> spyHandler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(spyHandler, times(1)).processImage(file);
    verify(spyHandler, times(1)).uploadImageToStorage(file);
  }

  @Test
  void shouldHandleMessage_When_UpdateFailed() throws ImageProcessingException, BucketOperationException, ElementNotFoundException {
    // Given
    String email = "test@test.com";
    ImageDto imageDto = new ImageDto(email, "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    doReturn(file).when(spyHandler).processImage(file);
    doNothing().when(spyHandler).uploadImageToStorage(file);
    doThrow(ElementNotFoundException.class).when(spyHandler)
        .updateAndCleanupProfileImage(email, file);

    // When + Then
    Executable executable = () -> spyHandler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(spyHandler, times(1)).processImage(file);
    verify(spyHandler, times(1)).uploadImageToStorage(file);
    verify(spyHandler, times(1)).updateAndCleanupProfileImage(email, file);
  }

  @Test
  void shouldProcessImage() throws ImageProcessingException {
    // Given
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );

    when(imageProcessor.process(file)).thenReturn(mockImage);
    when(imageRandomizer.randomize(mockImage)).thenReturn(mockImage);
    when(imageService.writeToJpeg(mockImage)).thenReturn(file);

    // When
    InMemoryFile processedImage = handler.processImage(file);

    // Then
    assertNotNull(processedImage, "Processed image should be returned");
    verify(imageProcessor, times(1)).process(file);
    verify(imageRandomizer, times(1)).randomize(mockImage);
    verify(imageService, times(1)).writeToJpeg(mockImage);
  }

  @Test
  void shouldThrowProcessingImage_When_ProcessFailed() throws ImageProcessingException {
    // Given
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );
    when(imageProcessor.process(file)).thenThrow(ImageProcessingException.class);

    // When
    Executable executable = () -> handler.processImage(file);

    // Then
    assertThrows(ImageProcessingException.class, executable, "Method should propagate errors up");
    verify(imageProcessor, times(1)).process(file);
  }

  @Test
  void shouldThrowProcessingImage_When_RandomizingFailed() throws ImageProcessingException {
    // Given
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );

    when(imageProcessor.process(file)).thenReturn(mockImage);
    when(imageRandomizer.randomize(mockImage)).thenThrow(ImageProcessingException.class);

    // When
    Executable executable = () -> handler.processImage(file);

    // Then
    assertThrows(ImageProcessingException.class, executable, "Method should propagate errors up");
    verify(imageProcessor, times(1)).process(file);
    verify(imageRandomizer, times(1)).randomize(mockImage);
  }

  @Test
  void shouldThrowProcessingImage_When_WritingFailed() throws ImageProcessingException {
    // Given
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );

    when(imageProcessor.process(file)).thenReturn(mockImage);
    when(imageRandomizer.randomize(mockImage)).thenReturn(mockImage);
    when(imageService.writeToJpeg(mockImage)).thenThrow(ImageProcessingException.class);

    // When
    Executable executable = () -> handler.processImage(file);

    // Then
    assertThrows(ImageProcessingException.class, executable, "Method should propagate errors up");
    verify(imageProcessor, times(1)).process(file);
    verify(imageRandomizer, times(1)).randomize(mockImage);
    verify(imageService, times(1)).writeToJpeg(mockImage);
  }

  @Test
  void shouldUploadImageToStorage() {
    // Given
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );
    BucketOperationResponse response = new BucketOperationResponse(true, -1, null);

    when(imageUploadService.uploadImage(file)).thenReturn(response);

    // When
    Executable executable = () -> handler.uploadImageToStorage(file);

    // Then
    assertDoesNotThrow(executable, "Exception should not be throw, when successful upload");
    verify(imageUploadService, times(1)).uploadImage(file);
  }

  @Test
  void shouldThrowUploadImage_When_UploadingFailed() {
    // Given
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );
    BucketOperationResponse response = new BucketOperationResponse(false, 404, null);

    when(imageUploadService.uploadImage(file)).thenReturn(response);

    // When
    Executable executable = () -> handler.uploadImageToStorage(file);

    // Then
    assertThrows(BucketOperationException.class, executable,
        "Exception should be thrown, when upload failed");
    verify(imageUploadService, times(1)).uploadImage(file);
  }

  @Test
  void shouldUpdateAndCleanup_When_Success_And_NotCallCleanup_When_ImageEmpty() throws ElementNotFoundException {
    // Given
    String email = "test@test.com";
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );
    Profile profile = new Profile(email, "Test", "Middle", "Last");

    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    doNothing().when(spyHandler).cleanupOldImage(anyString());

    // When
    Executable executable = () -> spyHandler.updateAndCleanupProfileImage(email, file);

    // Then
    assertDoesNotThrow(executable, "Exception should not be thrown");
    assertAll(
        () -> verify(profileService, times(1))
            .updateProfileImage(
                eq(profile),
                argThat(
                    argument -> file.getName().equals(argument.getName())
                        && file.getContentType().equals(argument.getContentType())
                        && file.getData().length == argument.getSize()
                )
            ),
        () -> verify(spyHandler, times(0)).cleanupOldImage(anyString())
    );
  }

  @Test
  void shouldUpdateAndCleanup_When_Success_And_CallCleanup_When_ImageExists() throws ElementNotFoundException {
    // Given
    String email = "test@test.com";
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );
    ProfileImage profileImage = new ProfileImage(
        file.getName(),
        file.getContentType(),
        file.getData().length
    );
    Profile profile = new Profile(null, email, "Test", "Middle", "Last", profileImage);

    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    doNothing().when(spyHandler).cleanupOldImage(anyString());

    // When
    Executable executable = () -> spyHandler.updateAndCleanupProfileImage(email, file);

    // Then
    assertDoesNotThrow(executable, "Exception should not be thrown");
    assertAll(
        () -> verify(profileService, times(1))
            .updateProfileImage(
                eq(profile),
                argThat(
                    argument -> file.getName().equals(argument.getName())
                        && file.getContentType().equals(argument.getContentType())
                        && file.getData().length == argument.getSize()
                )
            ),
        () -> verify(spyHandler, times(1)).cleanupOldImage(anyString())
    );
  }

  @Test
  void shouldFailUpdateAndCleanup_When_GetProfileThrows() throws ElementNotFoundException {
    // Given
    String email = "test@test.com";
    InMemoryFile file = new InMemoryFile(
        "image/jpeg",
        "test.jpeg",
        "test-data".getBytes()
    );

    when(profileService.getProfileByEmail(email)).thenThrow(ElementNotFoundException.class);

    // When
    Executable executable = () -> spyHandler.updateAndCleanupProfileImage(email, file);

    // Then
    assertThrows(ElementNotFoundException.class, executable, "Exception should be thrown");
  }

  @Test
  void shouldCleanupOldImage_When_DeleteSuccessful() {
    // Given
    String imageName = "image.jpeg";
    BucketOperationResponse response = new BucketOperationResponse(true, 200, null);

    when(imageUploadService.deleteImage(anyString())).thenReturn(response);

    // When
    handler.cleanupOldImage(imageName);

    // Then
    verify(imageUploadService, times(1)).deleteImage(imageName);
  }

  @Test
  void shouldCleanupOldImage_When_DeleteFails() {
    // Given
    String imageName = "image.jpeg";
    BucketOperationResponse response = new BucketOperationResponse(false, 404, null);

    when(imageUploadService.deleteImage(anyString())).thenReturn(response);

    // When
    handler.cleanupOldImage(imageName);

    // Then
    verify(imageUploadService, times(1)).deleteImage(imageName);
  }
}