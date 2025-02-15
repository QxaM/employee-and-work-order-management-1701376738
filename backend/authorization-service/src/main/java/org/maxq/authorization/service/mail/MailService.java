package org.maxq.authorization.service.mail;

public interface MailService {
  void sendVerificationEmail(String email, String token);

  void sendPasswordReset(String email, String token);
}
