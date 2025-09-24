package org.maxq.profileservice.service.image.processor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.jpeg.iptc.JpegIptcRewriter;
import org.apache.commons.imaging.formats.jpeg.xmp.JpegXmpRewriter;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.service.image.ImageService;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApacheImageProcessor implements ImageProcessor {
  private static final int MAX_IMAGE_WIDTH = 1024;
  private static final int MAX_IMAGE_HEIGHT = 1024;

  private final ImageService imageService;
  private final ExifRewriter exifRewriter;
  private final JpegXmpRewriter jpegXmpRewriter;
  private final JpegIptcRewriter jpegIptcRewriter;

  @Override
  public InMemoryFile stripMetadata(InMemoryFile file) throws IOException {
    log.debug("Stripping metadata from file {}", file.getName());

    if ("image/jpeg".equals(file.getContentType()) || "image/jpg".equals(file.getContentType())) {
      byte[] dataWithoutMeta = stripMetadata(file.getData());
      return new InMemoryFile(file.getContentType(), file.getName(), dataWithoutMeta);
    } else {
      log.info("File is not a JPEG, skipping stripping. Content type: {}", file.getContentType());
    }

    return file;
  }

  public byte[] stripMetadata(byte[] data) throws IOException {
    try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      exifRewriter.removeExifMetadata(data, os);
      byte[] dataWithoutExif = os.toByteArray();
      os.reset();

      jpegXmpRewriter.removeXmpXml(dataWithoutExif, os);
      byte[] dataWithoutXmp = os.toByteArray();
      os.reset();

      jpegIptcRewriter.removeIptc(dataWithoutXmp, os, true);
      return os.toByteArray();
    }
  }

  public BufferedImage resizeImage(InMemoryFile file) throws IOException {
    return resizeImage(file, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT);
  }

  @Override
  public BufferedImage resizeImage(InMemoryFile file, int maxWidth, int maxHeight) throws IOException {
    BufferedImage originalImage = imageService.getBufferedImage(file);
    Dimension newDimensions = calculateDimension(originalImage.getWidth(), originalImage.getHeight(), maxWidth, maxHeight);
    return imageService.resizeImage(originalImage, newDimensions);
  }

  @Override
  public BufferedImage cleanImage(BufferedImage image) {
    BufferedImage cleanImage = new BufferedImage(
        image.getWidth(),
        image.getHeight(),
        BufferedImage.TYPE_INT_RGB // Remove an alpha channel of PNG images
    );

    Graphics2D graphics = cleanImage.createGraphics();
    graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
    graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

    graphics.setColor(Color.WHITE);
    graphics.fillRect(0, 0, cleanImage.getWidth(), cleanImage.getHeight());
    graphics.drawImage(image, 0, 0, null);
    graphics.dispose();

    return cleanImage;
  }
}
