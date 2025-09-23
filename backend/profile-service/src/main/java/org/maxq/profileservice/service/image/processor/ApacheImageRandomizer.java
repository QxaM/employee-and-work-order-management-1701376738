package org.maxq.profileservice.service.image.processor;

import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.security.SecureRandom;
import java.util.stream.IntStream;

@Service
public class ApacheImageRandomizer implements ImageRandomizer {
  private static final float NOISE_LEVEL = 0.3f; // Percentage of pixels to be noisy

  private final SecureRandom secureRandom = new SecureRandom();

  @Override
  public BufferedImage addNoise(BufferedImage image) {
    BufferedImage noisyImage = new BufferedImage(image.getWidth(), image.getHeight(), image.getType());

    for (int x = 0; x < image.getWidth(); x++) {
      for (int y = 0; y < image.getHeight(); y++) {
        int rgb = image.getRGB(x, y);

        int red = (rgb >> 16) & 0xFF;
        int green = (rgb >> 8) & 0xFF;
        int blue = rgb & 0xFF;

        if (secureRandom.nextFloat() < NOISE_LEVEL) {
          int noise = secureRandom.nextInt(5) - 2;

          red = addNoiseToColor(red, noise);
          green = addNoiseToColor(green, noise);
          blue = addNoiseToColor(blue, noise);
        }

        int newRgb = (red << 16) | (green << 8) | blue;
        noisyImage.setRGB(x, y, newRgb);
      }
    }
    return noisyImage;
  }

  public int addNoiseToColor(int color, int noise) {
    return Math.clamp((long) color + noise, 0, 255);
  }

  @Override
  public BufferedImage addShifts(BufferedImage image) {
    int width = image.getWidth();
    int height = image.getHeight();

    int shiftX = secureRandom.nextInt(5) - 2;
    int shiftY = secureRandom.nextInt(5) - 2;

    if (shiftX == 0 && shiftY == 0) {
      return image;
    }

    BufferedImage shiftedImage = new BufferedImage(width, height, image.getType());
    Graphics2D graphics = shiftedImage.createGraphics();

    Color edgeColor = getEdgeColor(image);
    graphics.setColor(edgeColor);
    graphics.fillRect(0, 0, width, height);

    graphics.drawImage(image, shiftX, shiftY, null);
    graphics.dispose();

    return shiftedImage;
  }

  public Color getEdgeColor(BufferedImage image) {
    IntStream bottomTopStream = IntStream.range(0, image.getWidth())
        .flatMap(x ->
            IntStream.of(
                image.getRGB(x, 0),
                image.getRGB(x, image.getHeight() - 1)
            )
        );
    IntStream leftRightStream = IntStream.range(1, image.getHeight() - 1)
        .flatMap(y ->
            IntStream.of(
                image.getRGB(0, y),
                image.getRGB(image.getWidth() - 1, y)
            )
        );
    int[] edgePixels =
        IntStream.concat(bottomTopStream, leftRightStream).toArray();

    int averageRed = (int) IntStream.of(edgePixels)
        .map(pixel -> (pixel >> 16) & 0xFF)
        .average().orElse(0);
    int averageGreen = (int) IntStream.of(edgePixels)
        .map(pixel -> (pixel >> 8) & 0xFF)
        .average().orElse(0);
    int averageBlue = (int) IntStream.of(edgePixels)
        .map(pixel -> pixel & 0xFF)
        .average().orElse(0);

    return new Color(averageRed, averageGreen, averageBlue);
  }

  @Override
  public BufferedImage randomize(BufferedImage image) {
    BufferedImage imageWithNoise = addNoise(image);
    return addShifts(imageWithNoise);
  }
}
