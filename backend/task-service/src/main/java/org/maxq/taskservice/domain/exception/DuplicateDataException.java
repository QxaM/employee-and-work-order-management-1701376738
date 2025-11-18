package org.maxq.taskservice.domain.exception;

public class DuplicateDataException extends Exception {
  public DuplicateDataException(String message, Throwable cause) {
    super(message, cause);
  }
}
