package org.maxq.profileservice.service.validation.file;

import lombok.Getter;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.service.validation.AbstractValidationService;

import java.io.IOException;

@Getter
public abstract class ContentValidationService extends AbstractValidationService {

  protected final InMemoryFile file;

  protected ContentValidationService(InMemoryFile file) {
    super();
    this.file = file;
  }

  public abstract ContentValidationService validateSignature() throws IOException;
}
