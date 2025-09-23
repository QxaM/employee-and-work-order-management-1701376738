package org.maxq.profileservice.service.image;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.Imaging;
import org.apache.commons.imaging.ImagingException;
import org.apache.commons.imaging.formats.jpeg.JpegImageMetadata;
import org.apache.commons.imaging.formats.jpeg.JpegImageParser;
import org.apache.commons.imaging.formats.png.PngImageParser;
import org.apache.commons.imaging.formats.tiff.TiffField;
import org.apache.commons.imaging.formats.tiff.TiffImageMetadata;
import org.maxq.profileservice.domain.ImageMetadata;
import org.maxq.profileservice.domain.ImageSize;
import org.maxq.profileservice.domain.InMemoryFile;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
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
  public static final float COMPRESSION_QUALITY = 0.9f;
  private static final int MIN_EXIF_FIELDS = 2; // Expected at least width and height fields

  private final ImageWriterFactory imageWriterFactory;

  @Override
  public BufferedImage getBufferedImage(InMemoryFile file) throws IOException {
    return Imaging.getBufferedImage(file.getData());
  }

  @Override
  public BufferedImage getBufferedImage(byte[] imageData) throws IOException {
    return Imaging.getBufferedImage(imageData);
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
  public InMemoryFile writeToJpeg(BufferedImage image) throws IOException {
    ImageWriter jpegImageWriter = imageWriterFactory.createJpegImageWriter();

    try (ByteArrayOutputStream os = new ByteArrayOutputStream();
         ImageOutputStream ios = ImageIO.createImageOutputStream(os)) {
      jpegImageWriter.setOutput(ios);

      ImageWriteParam params = jpegImageWriter.getDefaultWriteParam();
      params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
      params.setCompressionQuality(COMPRESSION_QUALITY);
      IIOImage newImage = new IIOImage(image, null, null);

      jpegImageWriter.write(null, newImage, params);
      return InMemoryFile.create(os.toByteArray(), "image/jpeg");
    } finally {
      jpegImageWriter.dispose();
    }
  }
}
