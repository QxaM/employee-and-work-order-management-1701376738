package org.maxq.profileservice.service.validation;

import org.maxq.profileservice.domain.exception.FileValidationException;

public interface ValidationService<T> {

  ValidationService<T> of(T object);

  void validate() throws FileValidationException;
}
