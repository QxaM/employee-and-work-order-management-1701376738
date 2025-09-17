package org.maxq.profileservice.service.message.handler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.maxq.profileservice.service.image.processor.ApacheImageProcessor;
import org.maxq.profileservice.service.image.processor.ApacheImageRandomizer;
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
  @MockitoBean
  private ApacheImageProcessor imageProcessor;
  @MockitoBean
  private ApacheImageRandomizer imageRandomizer;

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
    when(imageProcessor.stripMetadata(file)).thenReturn(file);
    when(imageProcessor.resizeImage(file)).thenReturn(mockImage);
    when(imageProcessor.cleanImage(mockImage)).thenReturn(mockImage);
    when(imageRandomizer.randomize(mockImage)).thenReturn(mockImage);
    when(imageService.writeToJpeg(mockImage)).thenReturn(file);

    // When
    handler.handleMessage(imageDto);

    // Then
    verify(imageProcessor, times(1)).stripMetadata(file);
    verify(imageProcessor, times(1)).resizeImage(file);
    verify(imageProcessor, times(1)).cleanImage(mockImage);
    verify(imageRandomizer, times(1)).randomize(mockImage);
    verify(imageService, times(1)).writeToJpeg(mockImage);
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
    doThrow(IOException.class).when(imageProcessor).stripMetadata(file);

    // When + Then
    Executable executable = () -> handler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(imageProcessor, times(1)).stripMetadata(file);
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
    when(imageProcessor.stripMetadata(file)).thenReturn(file);
    doThrow(IOException.class).when(imageProcessor).resizeImage(file);

    // When + Then
    Executable executable = () -> handler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(imageProcessor, times(1)).stripMetadata(file);
  }

  @Test
  void shouldHandleMessage_When_WritingFailed() throws IOException {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpeg", "image/jpeg", "test-data".getBytes());
    InMemoryFile file = new InMemoryFile(
        imageDto.getContentType(),
        imageDto.getName(),
        imageDto.getData()
    );
    when(inMemoryFileMapper.mapToInMemoryFile(imageDto)).thenReturn(file);
    when(imageProcessor.stripMetadata(file)).thenReturn(file);
    when(imageProcessor.resizeImage(file)).thenReturn(mockImage);
    when(imageProcessor.cleanImage(mockImage)).thenReturn(mockImage);
    doThrow(IOException.class).when(imageService).writeToJpeg(mockImage);


    // When
    Executable executable = () -> handler.handleMessage(imageDto);

    // Then
    assertDoesNotThrow(executable);
    verify(imageService, times(1)).writeToJpeg(mockImage);
  }
}