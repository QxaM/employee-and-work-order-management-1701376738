package org.maxq.taskservice.domain.exception;

public class UserDoesNotExistException extends Exception {
  public UserDoesNotExistException(String message) {
    super(message);
  }
}
