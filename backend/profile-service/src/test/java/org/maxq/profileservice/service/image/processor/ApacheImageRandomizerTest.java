package org.maxq.profileservice.service.image.processor;

import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.awt.image.BufferedImage;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ApacheImageRandomizerTest {

  @Autowired
  private ApacheImageRandomizer randomizer;

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

  @Test
  void shouldRandomizeImage() {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    ApacheImageRandomizer spyRandomizer = spy(ApacheImageRandomizer.class);

    // When
    spyRandomizer.randomize(image);

    // Then
    verify(spyRandomizer, times(1)).addNoise(image);
  }
}