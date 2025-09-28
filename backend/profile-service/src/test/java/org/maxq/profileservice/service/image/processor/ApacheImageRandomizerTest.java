package org.maxq.profileservice.service.image.processor;

import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.maxq.profileservice.domain.exception.ImageProcessingException;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.maxq.profileservice.service.image.ImageWriterFactory;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import javax.imageio.IIOImage;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ApacheImageRandomizerTest {

  @Autowired
  private ApacheImageRandomizer randomizer;

  @Mock
  private ImageWriter jpegImageWriter;

  @MockitoBean
  private ImageWriterFactory imageWriterFactory;
  @MockitoBean
  private ApacheImageService imageService;

  protected static Stream<Color> uniformColors() {
    return Stream.of(Color.BLACK, Color.WHITE,
        Color.RED, Color.GREEN, Color.BLUE,
        Color.YELLOW, Color.PINK, new Color(128, 54, 1));
  }

  @BeforeEach
  void setUp() {
    when(imageWriterFactory.createJpegImageWriter()).thenReturn(jpegImageWriter);
  }


  @Test
  void shouldAddNoiseToColor() {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    int[] originalPixels = image.getRGB(0, 0, 100, 100, null, 0, 100);

    // When
    BufferedImage noisyImage = randomizer.addNoise(image);
    int[] noisyPixels = noisyImage.getRGB(0, 0, 100, 100, null, 0, 100);

    // Then
    assertFalse(Arrays.equals(originalPixels, noisyPixels),
        "Pixels should not be equal - noise should be added");
  }

  @Test
  void shouldAddNoiseToColor_When_ColorInbound() {
    // Given
    short upperBound = 253;
    short lowerBound = 2;
    short change = 1;

    // When
    int upperBoundWithNoise = randomizer.addNoiseToColor(upperBound, change);
    int lowerBoundWithNoise = randomizer.addNoiseToColor(lowerBound, -change);

    // Then
    assertEquals(upperBound + change, upperBoundWithNoise, "Upper bound should be increased by noise");
    assertEquals(lowerBound - change, lowerBoundWithNoise, "Lower bound should be decreased by noise");
  }

  @Test
  void shouldAddNoiseToColor_When_ColorOutsideBounds() {
    // Given
    short upperBound = 254;
    short lowerBound = 1;
    short change = 2;

    // When
    int upperBoundWithNoise = randomizer.addNoiseToColor(upperBound, change);
    int lowerBoundWithNoise = randomizer.addNoiseToColor(lowerBound, -change);

    // Then
    assertAll(
        () -> assertEquals(255, upperBoundWithNoise, "Upper bound should be limited to 255"),
        () -> assertEquals(0, lowerBoundWithNoise, "Lower bound should be limited to 0")
    );
  }

  @ParameterizedTest
  @MethodSource("uniformColors")
  void shouldReturnAverageColor_WhenImageUniform(Color color) {
    // Given
    int width = 100;
    int height = 100;
    BufferedImage image = new SimpleBufferedImageFactory()
        .getColorBufferedImage(width, height, false);
    Graphics g = image.getGraphics();
    g.setColor(color);
    g.fillRect(0, 0, width, height);

    // When
    Color averageColor = randomizer.getEdgeColor(image);

    // Then
    assertEquals(color, averageColor, "Average color should be equal to input color");
  }

  @Test
  void shouldShiftImage() {
    // Given
    int size = 5;
    BufferedImage image = new SimpleBufferedImageFactory()
        .getColorBufferedImage(size, size, false);
    Graphics g = image.getGraphics();
    g.setColor(Color.BLACK);
    g.fillRect(0, 0, size, size);
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, size, 1);
    g.fillRect(0, size - 1, size, size);
    int[] originalPixels = image.getRGB(0, 0, size, size, null, 0, size);

    // When
    BufferedImage shiftedImage = randomizer.addShifts(image);
    int[] shiftedPixels = shiftedImage.getRGB(0, 0, size, size, null, 0, size);

    // Then
    assertNotEquals(originalPixels, shiftedPixels,
        "Pixels should not be equal - shifts should be added");
  }

  @Test
  void shouldReturnAverageColor_WhenNonUniform() {
    // Given
    int size = 5;
    int allEdgePixels = 4 * size - 4;
    BufferedImage image = new SimpleBufferedImageFactory()
        .getColorBufferedImage(size, size, false);
    Graphics g = image.getGraphics();
    g.setColor(Color.BLACK);
    g.fillRect(0, 0, size, size);
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, size, 1);
    g.fillRect(0, size - 1, size, size);
    g.dispose();

    // When
    Color averageColor = randomizer.getEdgeColor(image);
    int expectedAverage = 2 * size * 255 / allEdgePixels;
    Color color = new Color(expectedAverage, expectedAverage, expectedAverage);

    // Then
    assertEquals(color, averageColor, "Average color should be equal to input color");
  }

  @Test
  void shouldAddNoiseToColorSpace() {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    Graphics g = image.getGraphics();
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, 100, 100);
    g.dispose();
    int[] originalPixels = image.getRGB(0, 0, 100, 100, null, 0, 100);

    // When
    BufferedImage noisyImage = randomizer.addColorSpaceNoise(image);
    int[] noisyPixels = noisyImage.getRGB(0, 0, 100, 100, null, 0, 100);

    // Then
    assertNotEquals(originalPixels, noisyPixels,
        "Pixels should not be equal - noise should be added");
  }

  @Test
  void shouldAddNoiseToHsb() {
    // Given
    float hueNoise = 0.01f;
    float saturationNoise = 0.01f;
    float[] originalHsb = {0.1f, 0.2f, 0.3f};

    // When
    float[] hsbWithNoise = randomizer.addNoiseToHsb(originalHsb, hueNoise, saturationNoise);

    // Then
    assertAll(
        () -> assertEquals(originalHsb[0] + hueNoise, hsbWithNoise[0],
            "Hue noise should be added correctly"),
        () -> assertEquals(originalHsb[1] + saturationNoise, hsbWithNoise[1],
            "Saturation noise should be added correctly"),
        () -> assertEquals(originalHsb[2], hsbWithNoise[2],
            "Brightness should not be changed")
    );
  }

  @Test
  void shouldApplyRandomCompression() throws IOException {
    // Given
    float minCompression = ApacheImageService.COMPRESSION_QUALITY;
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);

    when(imageService.getBufferedImage(any(byte[].class))).thenReturn(image);
    when(jpegImageWriter.getDefaultWriteParam()).thenReturn(new JPEGImageWriteParam(null));

    // When
    Executable executable = () -> randomizer.applyRandomCompression(image);

    // Then
    assertDoesNotThrow(executable, "Exception should not be thrown");
    verify(jpegImageWriter, times(1)).setOutput(any());
    verify(jpegImageWriter, times(1))
        .write(
            eq(null),
            any(IIOImage.class),
            argThat(writeParam ->
                writeParam.getCompressionMode() == ImageWriteParam.MODE_EXPLICIT
                    && writeParam.getCompressionQuality() >= minCompression
                    && writeParam.getCompressionQuality() <= 1f
            ));
  }

  @Test
  void shouldRandomCompressionThrow_When_writerThrows() throws IOException {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);

    when(imageService.getBufferedImage(any(byte[].class))).thenReturn(image);
    when(jpegImageWriter.getDefaultWriteParam()).thenReturn(new JPEGImageWriteParam(null));
    doThrow(IOException.class).when(jpegImageWriter).write(any(), any(), any());

    // When
    Executable executable = () -> randomizer.applyRandomCompression(image);

    // Then
    assertThrows(IOException.class, executable, "Exception should be thrown");
  }

  @Test
  void shouldRandomCompressionThrow_When_Throws() throws IOException {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);

    when(jpegImageWriter.getDefaultWriteParam()).thenReturn(new JPEGImageWriteParam(null));
    doThrow(IOException.class).when(imageService).getBufferedImage(any(byte[].class));

    // When
    Executable executable = () -> randomizer.applyRandomCompression(image);

    // Then
    assertThrows(IOException.class, executable, "Exception should be thrown");
  }

  @Test
  void shouldRandomizeImage() throws IOException {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    ApacheImageRandomizer spyRandomizer = spy(randomizer);

    when(jpegImageWriter.getDefaultWriteParam()).thenReturn(new JPEGImageWriteParam(null));
    when(imageService.getBufferedImage(any(byte[].class))).thenReturn(image);

    // When
    Executable executable = () -> spyRandomizer.randomize(image);

    // Then
    assertDoesNotThrow(executable, "Exception should not be thrown");
    verify(spyRandomizer, times(1)).addNoise(image);
    verify(spyRandomizer, times(1)).addShifts(any(BufferedImage.class));
    verify(spyRandomizer, times(1)).addColorSpaceNoise(any(BufferedImage.class));
    verify(spyRandomizer, times(1)).applyRandomCompression(any(BufferedImage.class));
  }

  @Test
  void shouldThrow_When_RandomizeThrows() throws IOException {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    ApacheImageRandomizer spyRandomizer = spy(randomizer);
    doThrow(IOException.class).when(spyRandomizer).applyRandomCompression(any(BufferedImage.class));

    // When
    Executable executable = () -> spyRandomizer.randomize(image);

    // Then
    assertThrows(ImageProcessingException.class, executable, "Exception should be thrown");
    verify(spyRandomizer, times(1)).addNoise(image);
    verify(spyRandomizer, times(1)).addShifts(any(BufferedImage.class));
    verify(spyRandomizer, times(1)).addColorSpaceNoise(any(BufferedImage.class));
  }
}