package org.maxq.profileservice.domain;

import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
public class ValidationResult implements Serializable {

  @Serial
  private static final long serialVersionUID = 2496078913062836116L;

  private final Set<ValidationError> messages;
  private boolean valid;

  public ValidationResult() {
    this.valid = true;
    messages = new HashSet<>();
  }

  public void addError(ValidationError error) {
    valid = false;
    messages.add(error);
  }

  public void clear() {
    valid = true;
    messages.clear();
  }
}
