package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.repository.VerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

  private static final Integer TOKEN_EXPIRATION_TIME = 60 * 24;
  private static final String VERIFICATION_TOKEN_NOT_FOUND = "Verification token was not found";

  private final VerificationTokenRepository verificationTokenRepository;

  public VerificationToken createToken(User user) {
    VerificationToken token = new VerificationToken(
        UUID.randomUUID().toString(),
        user,
        LocalDateTime.now()
    );
    return verificationTokenRepository.save(token);
  }

  public VerificationToken getToken(String token) throws ElementNotFoundException {
    Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);
    return verificationToken.orElseThrow(() ->
        new ElementNotFoundException(VERIFICATION_TOKEN_NOT_FOUND));
  }

  public VerificationToken getTokenByUser(User user) throws ElementNotFoundException {
    List<VerificationToken> tokens = verificationTokenRepository.findAllByUser(user);
    return tokens.stream()
        .filter(token ->
            token.getCreationDate().plusMinutes(23L * 60).isAfter(LocalDateTime.now()))
        .min((token1, token2) -> token2.getCreationDate().compareTo(token1.getCreationDate()))
        .orElseThrow(() ->
            new ElementNotFoundException(VERIFICATION_TOKEN_NOT_FOUND));
  }

  public void updateCreationDate(String token, LocalDateTime creationDate) throws ElementNotFoundException {
    Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);

    if (verificationToken.isEmpty()) {
      throw new ElementNotFoundException(VERIFICATION_TOKEN_NOT_FOUND);
    }

    VerificationToken updatedToken = verificationToken.get();
    updatedToken.setCreationDate(creationDate);
    verificationTokenRepository.save(updatedToken);
  }

  public void validateToken(VerificationToken token) throws ExpiredVerificationToken {
    LocalDateTime expirationTime = token.getCreationDate().plusMinutes(TOKEN_EXPIRATION_TIME);
    if (expirationTime.isBefore(LocalDateTime.now())) {
      throw new ExpiredVerificationToken("Provided verification token expired at: " + expirationTime);
    }
  }
}
