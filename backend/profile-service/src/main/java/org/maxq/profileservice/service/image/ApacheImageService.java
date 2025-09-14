package org.maxq.profileservice.service.image;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.Imaging;
import org.apache.commons.imaging.ImagingException;
import org.apache.commons.imaging.formats.jpeg.JpegImageMetadata;
import org.apache.commons.imaging.formats.jpeg.JpegImageParser;
import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.jpeg.iptc.JpegIptcRewriter;
import org.apache.commons.imaging.formats.jpeg.xmp.JpegXmpRewriter;
import org.apache.commons.imaging.formats.png.PngImageParser;
import org.apache.commons.imaging.formats.tiff.TiffField;
import org.apache.commons.imaging.formats.tiff.TiffImageMetadata;
import org.maxq.profileservice.domain.ImageMetadata;
import org.maxq.profileservice.domain.ImageSize;
import org.maxq.profileservice.domain.InMemoryFile;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApacheImageService implements ImageService {
  private static final int MIN_EXIF_FIELDS = 2; // Expected at least width and height fields
  private static final int MAX_IMAGE_WIDTH = 1024;
  private static final int MAX_IMAGE_HEIGHT = 1024;

  private final ExifRewriter exifRewriter;
  private final JpegXmpRewriter jpegXmpRewriter;
  private final JpegIptcRewriter jpegIptcRewriter;

  @Override
  public BufferedImage getBufferedImage(InMemoryFile file) throws IOException {
    return Imaging.getBufferedImage(file.getData());
  }

  @Override
  public ImageFormat guessFormat(byte[] imageData) throws IOException {
    return Imaging.guessFormat(imageData);
  }

  @Override
  public List<AbstractImageParser<?>> getParsers() {
    return List.of(new JpegImageParser(), new PngImageParser());
  }

  @Override
  public ImageMetadata getMetadata(byte[] imageData) throws IOException {
    org.apache.commons.imaging.common.ImageMetadata metadata = Imaging.getMetadata(imageData);
    Dimension imageSize = Imaging.getImageSize(imageData);

    List<TiffField> fields = getExifFields(metadata);
    ImageSize metaSize = getMetaSize(fields).orElse(null);

    return new ImageMetadata(
        new ImageSize(imageSize.width, imageSize.height),
        metaSize
    );
  }

  public List<TiffField> getExifFields(org.apache.commons.imaging.common.ImageMetadata metadata) {
    return Optional.ofNullable(metadata)
        .filter(JpegImageMetadata.class::isInstance)
        .map(JpegImageMetadata.class::cast)
        .map(JpegImageMetadata::getExif)
        .map(TiffImageMetadata::getAllFields)
        .orElse(Collections.emptyList());
  }

  public Optional<ImageSize> getMetaSize(List<TiffField> fields) throws ImagingException {
    log.debug("Exif fields: {}", fields);
    if (fields.size() < MIN_EXIF_FIELDS) {
      return Optional.empty();
    }
    Optional<TiffField> widthField =
        fields.stream().filter(field -> "ExifImageWidth".equals(field.getTagName())).findFirst();
    Optional<TiffField> heightField =
        fields.stream().filter(field -> "ExifImageLength".equals(field.getTagName())).findFirst();

    log.debug("Width field: {}, height field: {}", widthField, heightField);
    if (widthField.isEmpty() || heightField.isEmpty()) {
      return Optional.empty();
    }

    return Optional.of(
        new ImageSize(widthField.get().getIntValue(), heightField.get().getIntValue())
    );
  }

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
    BufferedImage originalImage = getBufferedImage(file);
    Dimension newDimensions = calculateDimension(originalImage.getWidth(), originalImage.getHeight(), maxWidth, maxHeight);
    return new BufferedImage(newDimensions.width, newDimensions.height, originalImage.getType());
  }
}
