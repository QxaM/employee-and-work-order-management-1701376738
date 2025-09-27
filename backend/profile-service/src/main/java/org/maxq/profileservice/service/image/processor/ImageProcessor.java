package org.maxq.profileservice.service.image.processor;

import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.exception.ImageProcessingException;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

public interface ImageProcessor {

  BufferedImage stripMetadata(InMemoryFile file) throws IOException;

  BufferedImage resizeImage(BufferedImage file, int maxWidth, int maxHeight) throws IOException;

  BufferedImage cleanImage(BufferedImage image);

  BufferedImage process(InMemoryFile file) throws IOException, ImageProcessingException;

  default Dimension calculateDimension(int originalWidth, int originalHeight,
                                       int maxWidth, int maxHeight) {
    double oneToOneRatio = 1.0;
    double widthRatio = (double) maxWidth / originalWidth;
    double heightRatio = (double) maxHeight / originalHeight;
    double ratio = Math.min(widthRatio, heightRatio);

    if (ratio >= oneToOneRatio) {
      return new Dimension(originalWidth, originalHeight);
    }

    return new Dimension(
        (int) (originalWidth * ratio),
        (int) (originalHeight * ratio)
    );
  }
}
