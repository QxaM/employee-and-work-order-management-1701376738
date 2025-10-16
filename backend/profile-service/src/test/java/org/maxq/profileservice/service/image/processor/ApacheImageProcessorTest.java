package org.maxq.profileservice.service.image.processor;

import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.jpeg.iptc.JpegIptcRewriter;
import org.apache.commons.imaging.formats.jpeg.xmp.JpegXmpRewriter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.exception.ImageProcessingException;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ApacheImageProcessorTest {

  private static final int MAX_RESIZE_DIMENSION = 1024;

  @Autowired
  private ApacheImageProcessor imageProcessor;

  @MockitoBean
  private ExifRewriter exifWriter;
  @MockitoBean
  private JpegXmpRewriter xmpWriter;
  @MockitoBean
  private JpegIptcRewriter iptcWriter;
  @MockitoBean
  private ApacheImageService imageService;


  private static Stream<DimensionHelper> invalidImageDimensions() {
    return Stream.of(
        new DimensionHelper(
            new Dimension(1025, MAX_RESIZE_DIMENSION),
            new Dimension(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION)
        ),
        new DimensionHelper(
            new Dimension(MAX_RESIZE_DIMENSION, 1025),
            new Dimension(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION)
        ),
        new DimensionHelper(
            new Dimension(2 * MAX_RESIZE_DIMENSION, 1025),
            new Dimension(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION)
        )
    );
  }

  @Test
  void shouldStrip_When_JpegFile() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/jpeg");
    BufferedImage mockImage = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);

    doNothing().when(exifWriter).removeExifMetadata(any(byte[].class), any(ByteArrayOutputStream.class));
    doNothing().when(xmpWriter).removeXmpXml(any(byte[].class), any(ByteArrayOutputStream.class));
    doNothing().when(iptcWriter)
        .removeIptc(any(byte[].class), any(ByteArrayOutputStream.class), anyBoolean());
    when(imageService.getBufferedImage((byte[]) any())).thenReturn(mockImage);

    // When
    BufferedImage strippedFile = imageProcessor.stripMetadata(file);

    // Then
    verify(exifWriter, times(1))
        .removeExifMetadata(eq(file.getData()), any(ByteArrayOutputStream.class));
    verify(xmpWriter, times(1))
        .removeXmpXml(any(byte[].class), any(ByteArrayOutputStream.class));
    verify(iptcWriter, times(1))
        .removeIptc(any(byte[].class), any(ByteArrayOutputStream.class), eq(true));
    assertNotNull(strippedFile, "New file should be created");
  }

  @Test
  void shouldStrip_When_PngFile() throws IOException {
    // Given
    BufferedImage mockImage = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");

    when(imageService.getBufferedImage(file)).thenReturn(mockImage);

    // When
    BufferedImage strippedFile = imageProcessor.stripMetadata(file);

    // Then
    assertNotNull(strippedFile, "New file should be created");
  }

  @Test
  void shouldCalculateDimension_For_SmallerImages() {
    // Given
    int smallerWidth = 100;
    int smallerHeight = 100;
    int maxWidth = 1024;
    int maxHeight = 1024;

    // When
    Dimension newDimension
        = imageProcessor.calculateDimension(smallerWidth, smallerHeight, maxWidth, maxHeight);

    // Then
    assertAll(
        () -> assertEquals(smallerWidth, newDimension.width, "Width should be equal"),
        () -> assertEquals(smallerHeight, newDimension.height, "Height should be equal")
    );
  }

  @ParameterizedTest
  @MethodSource("invalidImageDimensions")
  void shouldCalculateDimension_For_BiggerImages(DimensionHelper dimensionHelper) {
    // Given
    double expectedRatio = Math.min(dimensionHelper.widthRatio, dimensionHelper.heightRatio);
    int expectedWidth = (int) (dimensionHelper.inputDimension.width * expectedRatio);
    int expectedHeight = (int) (dimensionHelper.inputDimension.height * expectedRatio);

    int biggerWidth = dimensionHelper.inputDimension.width;
    int biggerHeight = dimensionHelper.inputDimension.height;
    int maxWidth = dimensionHelper.maxDimension.width;
    int maxHeight = dimensionHelper.maxDimension.height;

    // When
    Dimension newDimension
        = imageProcessor.calculateDimension(biggerWidth, biggerHeight, maxWidth, maxHeight);

    // Then
    assertAll(
        () -> assertEquals(expectedWidth, newDimension.width, "Width should be equal"),
        () -> assertEquals(expectedHeight, newDimension.height, "Height should be equal")
    );
  }

  @Test
  void shouldResizeImage() throws IOException {
    // Given
    BufferedImage mockImage = mock(BufferedImage.class);
    int imageDimension = 2 * MAX_RESIZE_DIMENSION;

    when(mockImage.getWidth()).thenReturn(imageDimension);
    when(mockImage.getHeight()).thenReturn(imageDimension);
    when(mockImage.getType()).thenReturn(BufferedImage.TYPE_INT_RGB);

    // When
    imageProcessor.resizeImage(mockImage);

    // Then
    verify(imageService, times(1))
        .resizeImage(
            eq(mockImage),
            argThat(dim ->
                dim.getWidth() == MAX_RESIZE_DIMENSION && dim.getHeight() == MAX_RESIZE_DIMENSION)
        );
  }

  @Test
  void shouldCleanImage() {
    // Given
    int imageDimension = 2 * MAX_RESIZE_DIMENSION;
    BufferedImage mockImage = new SimpleBufferedImageFactory()
        .getColorBufferedImage(imageDimension, imageDimension, true);

    // When
    BufferedImage cleanImage = imageProcessor.cleanImage(mockImage);

    // Then
    assertAll(
        () -> assertEquals(BufferedImage.TYPE_INT_RGB, cleanImage.getType(),
            "Image type should be RGB"),
        () -> assertEquals(imageDimension, cleanImage.getWidth(), "Image width should be equal"),
        () -> assertEquals(imageDimension, cleanImage.getHeight(), "Image height should be equal")
    );
  }

  @Test
  void shouldProcess_When_Success() throws IOException, ImageProcessingException {
    // Given
    ApacheImageProcessor spyProcess = spy(imageProcessor);
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");
    BufferedImage mockImage = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);

    doReturn(mockImage).when(spyProcess).stripMetadata(file);
    doReturn(mockImage).when(spyProcess).resizeImage(mockImage);
    doReturn(mockImage).when(spyProcess).cleanImage(mockImage);

    // When
    BufferedImage processedImage = spyProcess.process(file);

    // Then
    assertNotNull(processedImage, "Image should be processed");
    assertAll(
        () -> verify(spyProcess, times(1)).stripMetadata(file),
        () -> verify(spyProcess, times(1)).resizeImage(mockImage),
        () -> verify(spyProcess, times(1)).cleanImage(mockImage)
    );
  }

  @Test
  void shouldThrowProcess_When_StrippingFails() throws IOException {
    // Given
    ApacheImageProcessor spyProcess = spy(imageProcessor);
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");

    doThrow(IOException.class).when(spyProcess).stripMetadata(file);

    // When
    Executable executable = () -> spyProcess.process(file);

    // Then
    assertThrows(ImageProcessingException.class, executable);
    verify(spyProcess, times(1)).stripMetadata(file);
  }

  @Test
  void shouldThrowProcess_When_ResizingFails() throws IOException {
    // Given
    ApacheImageProcessor spyProcess = spy(imageProcessor);
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");
    BufferedImage mockImage = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);

    doReturn(mockImage).when(spyProcess).stripMetadata(file);
    doThrow(IOException.class).when(spyProcess).resizeImage(mockImage);

    // When
    Executable executable = () -> spyProcess.process(file);

    // Then
    assertThrows(ImageProcessingException.class, executable);
    assertAll(
        () -> verify(spyProcess, times(1)).stripMetadata(file),
        () -> verify(spyProcess, times(1)).resizeImage(mockImage)
    );
  }

  private static final class DimensionHelper {
    private final Dimension inputDimension;
    private final Dimension maxDimension;
    private final double widthRatio;
    private final double heightRatio;

    private DimensionHelper(Dimension inputDimension, Dimension maxDimension) {
      this.inputDimension = inputDimension;
      this.maxDimension = maxDimension;
      this.widthRatio = (double) maxDimension.width / inputDimension.width;
      this.heightRatio = (double) maxDimension.height / inputDimension.height;
    }
  }
}
