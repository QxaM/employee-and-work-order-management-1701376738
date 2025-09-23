package org.maxq.profileservice.service.image;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;

@Service
public class ImageWriterFactory {

  public ImageWriter createJpegImageWriter() {
    return ImageIO.getImageWritersByFormatName("jpeg").next();
  }
}
