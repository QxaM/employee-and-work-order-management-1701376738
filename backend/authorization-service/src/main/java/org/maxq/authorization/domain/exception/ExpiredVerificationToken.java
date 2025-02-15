package org.maxq.authorization.domain.exception;

public class ExpiredVerificationToken extends Exception {
  public ExpiredVerificationToken(String message) {
    super(message);
  }
}
