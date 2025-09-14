package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.maxq.profileservice.domain.ImageMetadata;
import org.maxq.profileservice.domain.InMemoryFile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;

public interface ImageService {
  BufferedImage getBufferedImage(InMemoryFile file) throws IOException;

  ImageFormat guessFormat(byte[] imageData) throws IOException;

  @SuppressWarnings({"java:S1452"})
  List<AbstractImageParser<?>> getParsers();

  ImageMetadata getMetadata(byte[] imageData) throws IOException;

  InMemoryFile stripMetadata(InMemoryFile file) throws IOException;

  BufferedImage resizeImage(InMemoryFile file, int maxWidth, int maxHeight) throws IOException;

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
