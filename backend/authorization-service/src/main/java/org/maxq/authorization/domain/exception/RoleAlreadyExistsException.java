package org.maxq.authorization.domain.exception;

public class RoleAlreadyExistsException extends Exception {
  public RoleAlreadyExistsException(String message) {
    super(message);
  }
}
