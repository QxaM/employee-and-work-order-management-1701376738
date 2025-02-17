package org.maxq.authorization.domain.exception;

public class DuplicateRoleException extends Exception {
  public DuplicateRoleException(String message, Throwable cause) {
    super(message, cause);
  }
}
