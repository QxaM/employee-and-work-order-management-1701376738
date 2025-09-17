package org.maxq.profileservice.service.image.processor;

import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.security.SecureRandom;

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
  public BufferedImage randomize(BufferedImage image) {
    return addNoise(image);
  }
}
