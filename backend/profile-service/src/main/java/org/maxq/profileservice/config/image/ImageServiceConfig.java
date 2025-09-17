package org.maxq.profileservice.config.image;

import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.jpeg.iptc.JpegIptcRewriter;
import org.apache.commons.imaging.formats.jpeg.xmp.JpegXmpRewriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;

@Configuration
public class ImageServiceConfig {

  @Bean
  public ExifRewriter exifRewriter() {
    return new ExifRewriter();
  }

  @Bean
  public JpegXmpRewriter jpegXmpRewriter() {
    return new JpegXmpRewriter();
  }

  @Bean
  public JpegIptcRewriter jpegIptcRewriter() {
    return new JpegIptcRewriter();
  }

  @Bean
  public ImageWriter jpegImageWriter() {
    return ImageIO.getImageWritersByFormatName("jpeg").next();
  }
}
