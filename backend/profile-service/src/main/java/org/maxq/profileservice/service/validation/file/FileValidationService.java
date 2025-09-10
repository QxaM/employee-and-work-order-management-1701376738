package org.maxq.profileservice.service.validation.file;

import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.service.validation.ValidationService;
import org.springframework.web.multipart.MultipartFile;

public abstract class FileValidationService implements ValidationService<MultipartFile> {

  protected final ValidationResult validationResult = new ValidationResult();
  protected MultipartFile file;

  public abstract FileValidationService validateName();

  public abstract FileValidationService validateExtension();

  public abstract FileValidationService validateContentType();

  @Override
  public FileValidationService of(MultipartFile object) {
    validationResult.clear();
    this.file = object;
    return this;
  }

  @Override
  public void validate() throws FileValidationException {
    if (!validationResult.isValid()) {
      throw new FileValidationException("File validation failed!", validationResult);
    }
  }
}
