package org.maxq.profileservice.service.validation.file;


import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.ImageFormats;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.ValidationError;
import org.maxq.profileservice.service.image.ImageService;

import java.io.IOException;
import java.util.List;

public class ImageContentValidationService extends ContentValidationService {
  public static final List<ImageFormat> IMAGE_FORMATS_ALLOWLIST
      = List.of(ImageFormats.JPEG, ImageFormats.PNG);
  public static final List<String> JPEG_CONTENT_TYPE_LIST = List.of("image/jpeg", "image/jpg");
  public static final List<String> PNG_CONTENT_TYPE_LIST = List.of("image/png");

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
}
