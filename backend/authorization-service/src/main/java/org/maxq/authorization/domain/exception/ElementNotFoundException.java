package org.maxq.authorization.domain.exception;

public class ElementNotFoundException extends Exception {
  public ElementNotFoundException(String message) {
    super(message);
  }

  public ElementNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
