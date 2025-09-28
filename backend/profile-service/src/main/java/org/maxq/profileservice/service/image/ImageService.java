package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.maxq.profileservice.domain.ImageMetadata;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.exception.ImageProcessingException;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;

public interface ImageService {
  BufferedImage getBufferedImage(InMemoryFile file) throws IOException;

  BufferedImage getBufferedImage(byte[] imageData) throws IOException;

  ImageFormat guessFormat(byte[] imageData) throws IOException;

  @SuppressWarnings({"java:S1452"})
  List<AbstractImageParser<?>> getParsers();

  ImageMetadata getMetadata(byte[] imageData) throws IOException;

  BufferedImage resizeImage(BufferedImage image, Dimension newDimensions) throws IOException;

  InMemoryFile writeToJpeg(BufferedImage image) throws IOException, ImageProcessingException;
}
