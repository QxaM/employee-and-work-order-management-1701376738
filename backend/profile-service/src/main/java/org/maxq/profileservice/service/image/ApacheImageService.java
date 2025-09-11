package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.Imaging;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ApacheImageService implements ImageService {

  @Override
  public ImageFormat guessFormat(byte[] imageData) throws IOException {
    return Imaging.guessFormat(imageData);
  }
}
