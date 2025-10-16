package org.maxq.profileservice.service.validation.file;

import lombok.Getter;
import org.maxq.profileservice.service.validation.AbstractValidationService;
import org.springframework.web.multipart.MultipartFile;

@Getter
public abstract class FileValidationService extends AbstractValidationService {

  protected final MultipartFile file;

  protected FileValidationService(MultipartFile file) {
    super();
    this.file = file;
  }

  public abstract FileValidationService validateName();

  public abstract FileValidationService validateExtension();

  public abstract FileValidationService validateContentType();

  public abstract FileValidationService validateSize();

}
