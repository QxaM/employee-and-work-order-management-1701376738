package org.maxq.profileservice.service.image.processor;

import java.awt.image.BufferedImage;

public interface ImageRandomizer {

  BufferedImage addNoise(BufferedImage image);

  BufferedImage addShifts(BufferedImage image);

  BufferedImage randomize(BufferedImage image);
}
