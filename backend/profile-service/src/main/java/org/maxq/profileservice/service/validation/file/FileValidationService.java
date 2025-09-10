package org.maxq.profileservice.service.validation.file;

import lombok.Getter;
import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.service.validation.ValidationService;
import org.springframework.web.multipart.MultipartFile;

@Getter
public abstract class FileValidationService implements ValidationService {

  protected final ValidationResult validationResult;
  protected final MultipartFile file;

  protected FileValidationService(MultipartFile file) {
    this.file = file;
    this.validationResult = new ValidationResult();
  }

  public abstract FileValidationService validateName();

  public abstract FileValidationService validateExtension();

  public abstract FileValidationService validateContentType();

  public abstract FileValidationService validateSize();

  @Override
  public void validate() throws FileValidationException {
    if (!validationResult.isValid()) {
      throw new FileValidationException("File validation failed!", validationResult);
    }
  }
}
