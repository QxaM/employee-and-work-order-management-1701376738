package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.Imaging;
import org.apache.commons.imaging.formats.jpeg.JpegImageParser;
import org.apache.commons.imaging.formats.png.PngImageParser;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ApacheImageService implements ImageService {

  @Override
  public ImageFormat guessFormat(byte[] imageData) throws IOException {
    return Imaging.guessFormat(imageData);
  }

  @Override
  public List<AbstractImageParser<?>> getParsers() {
    return List.of(new JpegImageParser(), new PngImageParser());
  }
}
