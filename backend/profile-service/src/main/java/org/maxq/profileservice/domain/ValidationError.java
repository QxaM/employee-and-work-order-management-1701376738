package org.maxq.profileservice.domain;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Getter
@RequiredArgsConstructor
public enum ValidationError implements Serializable {

  FILE_NAME(Messages.FILE_NAME_ERROR),
  FILE_EXTENSION(Messages.FILE_EXTENSION_ERROR);

  @Serial
  private static final long serialVersionUID = -4850791916657742834L;

  @JsonValue
  private final String message;

  static final class Messages {
    private static final String FILE_NAME_ERROR
        = "Invalid file name. Only numbers and letters are allowed";
    private static final String FILE_EXTENSION_ERROR
        = "Invalid file extension. Only .jpg, .png and .jpeg files are allowed";

    private Messages() {
      throw new IllegalStateException("Non-initializable class");
    }
  }

}
