package org.maxq.profileservice.service.image.processor;

import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.Arrays;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ApacheImageRandomizerTest {

  @Autowired
  private ApacheImageRandomizer randomizer;

  protected static Stream<Color> uniformColors() {
    return Stream.of(Color.BLACK, Color.WHITE,
        Color.RED, Color.GREEN, Color.BLUE,
        Color.YELLOW, Color.PINK, new Color(128, 54, 1));
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
    assertFalse(Arrays.equals(originalPixels, shiftedPixels),
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

    // When
    Color averageColor = randomizer.getEdgeColor(image);
    int expectedAverage = 2 * size * 255 / allEdgePixels;
    Color color = new Color(expectedAverage, expectedAverage, expectedAverage);

    // Then
    assertEquals(color, averageColor, "Average color should be equal to input color");
  }

  @Test
  void shouldRandomizeImage() {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    ApacheImageRandomizer spyRandomizer = spy(ApacheImageRandomizer.class);

    // When
    spyRandomizer.randomize(image);

    // Then
    verify(spyRandomizer, times(1)).addNoise(image);
    verify(spyRandomizer, times(1)).addShifts(any(BufferedImage.class));
  }
}