package org.maxq.profileservice.service.validation;

import lombok.Getter;
import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.exception.FileValidationException;

@Getter
public abstract class AbstractValidationService implements ValidationService {

  protected final ValidationResult validationResult;

  protected AbstractValidationService() {
    this.validationResult = new ValidationResult();
  }

  @Override
  public void validate() throws FileValidationException {
    if (!validationResult.isValid()) {
      throw new FileValidationException("File validation failed!", validationResult);
    }
  }
}
