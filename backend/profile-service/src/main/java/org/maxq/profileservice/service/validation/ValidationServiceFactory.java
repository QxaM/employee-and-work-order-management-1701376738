package org.maxq.profileservice.service.validation;

import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ValidationServiceFactory {

  public ImageValidationService createImageValidationService(MultipartFile file) {
    return new ImageValidationService(file);
  }
}
