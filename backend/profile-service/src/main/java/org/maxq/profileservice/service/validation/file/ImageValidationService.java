package org.maxq.profileservice.service.validation.file;

import org.maxq.profileservice.domain.ValidationError;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class ImageValidationService extends FileValidationService {
  public static final String IMAGE_FILE_NAME_ALLOWLIST = "[a-zA-Z0-9]";
  public static final Pattern IMAGE_FILE_NAME_REGEX =
      Pattern.compile("^" + IMAGE_FILE_NAME_ALLOWLIST + "+\\.[a-zA-Z0-9]+$");


  @Override
  public FileValidationService validateName() {
    if (file.getOriginalFilename() == null
        || !IMAGE_FILE_NAME_REGEX.matcher(file.getOriginalFilename()).matches()) {
      validationResult.addError(ValidationError.FILE_NAME);
    }
    return this;
  }
}
