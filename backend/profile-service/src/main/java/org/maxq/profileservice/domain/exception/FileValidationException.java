package org.maxq.profileservice.domain.exception;

import lombok.Getter;
import org.maxq.profileservice.domain.ValidationResult;

import java.io.Serial;

@Getter
public class FileValidationException extends Exception {

  @Serial
  private static final long serialVersionUID = -2396593256597210958L;

  private final ValidationResult validationResult;

  public FileValidationException(String message, ValidationResult validationResult) {
    super(message);
    this.validationResult = validationResult;
  }
}
