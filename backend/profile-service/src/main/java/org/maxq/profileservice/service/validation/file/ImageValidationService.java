package org.maxq.profileservice.service.validation.file;

import org.maxq.profileservice.domain.ValidationError;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ImageValidationService extends FileValidationService {
  public static final String IMAGE_FILE_NAME_ALLOWLIST = "[a-zA-Z0-9]";
  public static final String IMAGE_FILE_EXTENSION_ALLOWLIST = "(jpg|jpeg|png)";
  public static final Pattern IMAGE_FILE_NAME_REGEX =
      Pattern.compile("^" + IMAGE_FILE_NAME_ALLOWLIST + "+\\.[a-zA-Z0-9]+$");
  public static final Pattern IMAGE_EXTENSION_REGEX =
      Pattern.compile("^.+\\." + IMAGE_FILE_EXTENSION_ALLOWLIST + "$");
  public static final List<String> IMAGE_CONTENT_TYPE_ALLOWLIST
      = List.of("image/jpeg", "image/jpg", "image/png");


  @Override
  public FileValidationService validateName() {
    if (file.getOriginalFilename() == null
        || !IMAGE_FILE_NAME_REGEX.matcher(file.getOriginalFilename()).matches()) {
      validationResult.addError(ValidationError.FILE_NAME);
    }
    return this;
  }

  @Override
  public FileValidationService validateExtension() {
    if (file.getOriginalFilename() == null
        || !IMAGE_EXTENSION_REGEX.matcher(file.getOriginalFilename()).matches()) {
      validationResult.addError(ValidationError.FILE_EXTENSION);
    }
    return this;
  }

  @Override
  public FileValidationService validateContentType() {
    if (!IMAGE_CONTENT_TYPE_ALLOWLIST.contains(file.getContentType())) {
      validationResult.addError(ValidationError.FILE_CONTENT_TYPE);
    }
    return this;
  }
}
