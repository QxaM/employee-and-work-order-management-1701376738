package org.maxq.authorization.domain.exception;

public class RoleDoesNotExistException extends Exception {
  public RoleDoesNotExistException(String message) {
    super(message);
  }
}
