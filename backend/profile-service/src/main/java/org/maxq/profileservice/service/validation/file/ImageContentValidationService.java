package org.maxq.profileservice.service.validation.file;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.imaging.AbstractImageParser;
import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.ImageFormats;
import org.apache.commons.imaging.ImageInfo;
import org.apache.commons.imaging.bytesource.ByteSource;
import org.maxq.profileservice.domain.ImageMetadata;
import org.maxq.profileservice.domain.ImageSize;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.ValidationError;
import org.maxq.profileservice.service.image.ImageService;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;

@Slf4j
public class ImageContentValidationService extends ContentValidationService {
  public static final List<ImageFormat> IMAGE_FORMATS_ALLOWLIST
      = List.of(ImageFormats.JPEG, ImageFormats.PNG);
  public static final List<String> JPEG_CONTENT_TYPE_LIST = List.of("image/jpeg", "image/jpg");
  public static final List<String> PNG_CONTENT_TYPE_LIST = List.of("image/png");
  public static final int IMAGE_MAX_WIDTH = 8 * 1024;
  public static final int IMAGE_MAX_HEIGHT = 8 * 1024;

  private final ImageService imageService;

  public ImageContentValidationService(InMemoryFile file, ImageService imageService) {
    super(file);
    this.imageService = imageService;
  }

  @Override
  public ContentValidationService validateSignature() throws IOException {
    ImageFormat detectedFormat = imageService.guessFormat(file.getData());

    if (!IMAGE_FORMATS_ALLOWLIST.contains(detectedFormat)) {
      validationResult.addError(ValidationError.FILE_REAL_FORMAT);
      return this;
    }

    validateContentMismatch(detectedFormat);
    return this;
  }

  @Override
  public ContentValidationService validateRealContent() {
    List<AbstractImageParser<?>> imageParsers = imageService.getParsers();
    ByteSource imageSource = ByteSource.array(file.getData());

    boolean anyMatched = false;

    for (AbstractImageParser<?> parser : imageParsers) {
      try {
        ImageInfo imageInfo = parser.getImageInfo(imageSource);
        if (imageInfo != null) {
          BufferedImage image = parser.getBufferedImage(imageSource, null);

          if (image != null) {
            anyMatched = true;
          }
        }
      } catch (Exception e) {
        log.debug("Failed to parse image", e);
      }
    }

    if (!anyMatched) {
      validationResult.addError(ValidationError.FILE_REAL_FORMAT);
    }

    return this;
  }

  public void validateContentMismatch(ImageFormat detectedFormat) {
    if (file.getContentType() == null) {
      validationResult.addError(ValidationError.FILE_CONTENT_TYPE);
      return;
    }

    Runnable validationOperation = switch (detectedFormat) {
      case ImageFormats.JPEG -> () -> {
        if (!JPEG_CONTENT_TYPE_LIST.contains(file.getContentType())) {
          validationResult.addError(ValidationError.FILE_CONTENT_MISMATCH);
        }
      };
      case ImageFormats.PNG -> () -> {
        if (!PNG_CONTENT_TYPE_LIST.contains(file.getContentType())) {
          validationResult.addError(ValidationError.FILE_CONTENT_MISMATCH);
        }
      };
      default -> () -> validationResult.addError(ValidationError.FILE_REAL_FORMAT);
    };
    validationOperation.run();
  }

  @Override
  public ContentValidationService validateMetadata() throws IOException {
    ImageMetadata imageMetadata = imageService.getMetadata(file.getData());
    validateSize(imageMetadata);
    return this;
  }

  public void validateSize(ImageMetadata imageMetadata) {
    ImageSize size = imageMetadata.getSize();
    checkImageSize(size);

    ImageSize metaSize = imageMetadata.getMetaSize();
    if (metaSize != null) {
      checkImageSize(metaSize);
    }
  }

  public void checkImageSize(ImageSize imageSize) {
    if (imageSize.getWidth() > IMAGE_MAX_WIDTH || imageSize.getHeight() > IMAGE_MAX_HEIGHT) {
      validationResult.addError(ValidationError.IMAGE_SIZE);
    }
  }

}
