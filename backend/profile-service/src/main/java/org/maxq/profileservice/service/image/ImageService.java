package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.maxq.profileservice.domain.ImageMetadata;
import org.maxq.profileservice.domain.InMemoryFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {
  ImageFormat guessFormat(byte[] imageData) throws IOException;

  @SuppressWarnings({"java:S1452"})
  List<AbstractImageParser<?>> getParsers();

  ImageMetadata getMetadata(byte[] imageData) throws IOException;

  InMemoryFile stripMetadata(InMemoryFile file) throws IOException;
}
