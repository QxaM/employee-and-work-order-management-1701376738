package org.maxq.profileservice.service.image.processor;

import org.maxq.profileservice.domain.InMemoryFile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

public interface ImageProcessor {

  InMemoryFile stripMetadata(InMemoryFile file) throws IOException;

  BufferedImage resizeImage(InMemoryFile file, int maxWidth, int maxHeight) throws IOException;

  BufferedImage cleanImage(BufferedImage image);

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
