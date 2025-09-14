package org.maxq.profileservice.service.message.handler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.awt.image.BufferedImage;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@SpringBootTest
class ProfileImageUploadHandlerTest {

  @Autowired
  private ProfileImageUploadHandler handler;

  @MockitoBean
  private InMemoryFileMapper inMemoryFileMapper;
  @MockitoBean
  private ApacheImageService imageService;

  @Mock
  private BufferedImage mockImage;

  @BeforeEach
  void setUp() {
    when(mockImage.getWidth()).thenReturn(1024);
    when(mockImage.getHeight()).thenReturn(1024);
  }

  @Test
  void shouldHandleMessage_When_ProcessingSuccess() throws IOException {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    when(imageService.stripMetadata(file)).thenReturn(file);
    when(imageService.resizeImage(file)).thenReturn(mockImage);

    // When
    handler.handleMessage(imageDto);

    // Then
    verify(imageService, times(1)).stripMetadata(file);
    verify(imageService, times(1)).resizeImage(file);
  }

  @Test
  void shouldHandleMessage_When_MetadataStrippingFailed() throws IOException {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    doThrow(IOException.class).when(imageService).stripMetadata(file);

    // When + Then
    Executable executable = () -> handler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(imageService, times(1)).stripMetadata(file);
  }

  @Test
  void shouldHandleMessage_When_ResizingFailed() throws IOException {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    when(imageService.stripMetadata(file)).thenReturn(file);
    doThrow(IOException.class).when(imageService).resizeImage(file);

    // When + Then
    Executable executable = () -> handler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(imageService, times(1)).stripMetadata(file);
  }
}