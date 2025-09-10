package org.maxq.profileservice.service.validation;

import org.maxq.profileservice.domain.exception.FileValidationException;

public interface ValidationService {

  void validate() throws FileValidationException;
}
