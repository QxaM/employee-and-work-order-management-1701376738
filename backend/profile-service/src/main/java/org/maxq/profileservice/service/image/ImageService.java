package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;

import java.io.IOException;
import java.util.List;

public interface ImageService {
  ImageFormat guessFormat(byte[] imageData) throws IOException;

  @SuppressWarnings({"java:S1452"})
  List<AbstractImageParser<?>> getParsers();
}
