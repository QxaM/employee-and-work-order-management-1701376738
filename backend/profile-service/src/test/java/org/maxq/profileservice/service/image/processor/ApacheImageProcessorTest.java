package org.maxq.profileservice.service.image.processor;

import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.jpeg.iptc.JpegIptcRewriter;
import org.apache.commons.imaging.formats.jpeg.xmp.JpegXmpRewriter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.profileservice.domain.InMemoryFile;
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
    doNothing().when(exifWriter).removeExifMetadata(any(byte[].class), any(ByteArrayOutputStream.class));
    doNothing().when(xmpWriter).removeXmpXml(any(byte[].class), any(ByteArrayOutputStream.class));
    doNothing().when(iptcWriter)
        .removeIptc(any(byte[].class), any(ByteArrayOutputStream.class), anyBoolean());

    // When
    InMemoryFile strippedFile = imageProcessor.stripMetadata(file);

    // Then
    verify(exifWriter, times(1))
        .removeExifMetadata(eq(file.getData()), any(ByteArrayOutputStream.class));
    verify(xmpWriter, times(1))
        .removeXmpXml(any(byte[].class), any(ByteArrayOutputStream.class));
    verify(iptcWriter, times(1))
        .removeIptc(any(byte[].class), any(ByteArrayOutputStream.class), eq(true));
    assertNotEquals(file, strippedFile, "New file should be created");
  }

  @Test
  void shouldNotStrip_When_PngFile() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");

    // When
    InMemoryFile strippedFile = imageProcessor.stripMetadata(file);

    // Then
    assertEquals(file, strippedFile, "Original file should be returned");
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
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");
    int imageDimension = 2 * MAX_RESIZE_DIMENSION;

    doReturn(mockImage).when(imageService).getBufferedImage(file);
    when(mockImage.getWidth()).thenReturn(imageDimension);
    when(mockImage.getHeight()).thenReturn(imageDimension);
    when(mockImage.getType()).thenReturn(BufferedImage.TYPE_INT_RGB);

    // When
    BufferedImage newImage = imageProcessor.resizeImage(file);

    // Then
    assertAll(
        () -> assertEquals(MAX_RESIZE_DIMENSION, newImage.getWidth(),
            "Image should be correctly resized"),
        () -> assertEquals(MAX_RESIZE_DIMENSION, newImage.getHeight(),
            "Image should be correctly resized")
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
