package org.maxq.profileservice.domain.exception;

public class DataValidationException extends Exception {
  public DataValidationException(String message, Throwable cause) {
    super(message, cause);
  }
}
