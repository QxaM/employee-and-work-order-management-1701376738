package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.ImageFormat;

import java.io.IOException;

public interface ImageService {
  ImageFormat guessFormat(byte[] imageData) throws IOException;
}
