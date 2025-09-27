package org.maxq.profileservice.service.image.processor;

import org.maxq.profileservice.domain.exception.ImageProcessingException;

import java.awt.image.BufferedImage;
import java.io.IOException;

public interface ImageRandomizer {

  BufferedImage addNoise(BufferedImage image);

  BufferedImage addShifts(BufferedImage image);

  BufferedImage addColorSpaceNoise(BufferedImage image);

  BufferedImage applyRandomCompression(BufferedImage image) throws IOException;

  BufferedImage randomize(BufferedImage image) throws ImageProcessingException;
}
