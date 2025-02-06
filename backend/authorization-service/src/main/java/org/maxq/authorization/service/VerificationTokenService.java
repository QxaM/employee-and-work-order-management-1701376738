package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.repository.VerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

  private final VerificationTokenRepository verificationTokenRepository;

  public VerificationToken createToken(User user) {
    VerificationToken token = new VerificationToken(
        UUID.randomUUID().toString(),
        user,
        LocalDateTime.now()
    );
    return verificationTokenRepository.save(token);
  }
}
