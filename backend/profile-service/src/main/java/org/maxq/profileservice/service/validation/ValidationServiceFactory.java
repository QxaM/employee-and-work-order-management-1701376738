package org.maxq.profileservice.service.validation;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.service.image.ImageService;
import org.maxq.profileservice.service.validation.file.ImageContentValidationService;
import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ValidationServiceFactory {

  private final ImageService imageService;

  public ImageValidationService createImageValidationService(MultipartFile file) {
    return new ImageValidationService(file);
  }

  public ImageContentValidationService createImageContentValidationService(InMemoryFile file) {
    return new ImageContentValidationService(file, imageService);
  }
}
