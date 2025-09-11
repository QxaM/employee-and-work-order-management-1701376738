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
    }
    return this;
  }
}
