package org.maxq.authorization.domain.exception;

public class DuplicateEmailException extends Exception {
  
  public DuplicateEmailException(String message, Throwable cause) {
    super(message, cause);
  }
}
