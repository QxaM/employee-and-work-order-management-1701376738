package com.qxam.workmanagement.service;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.VerificationToken;
import com.qxam.workmanagement.domain.exception.ElementNotFound;
import com.qxam.workmanagement.repository.VerificationTokenRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationTokenDbService {

  private final VerificationTokenRepository repository;

  public UUID saveNewTokenForUser(User user) {
    VerificationToken token =
        new VerificationToken(new ObjectId(), UUID.randomUUID(), user.getId());

    return repository.insert(token).getToken();
  }

  public VerificationToken findToken(UUID token) throws ElementNotFound {
    Optional<VerificationToken> foundToken = repository.findByToken(token);
    return foundToken.orElseThrow(() -> new ElementNotFound("This token does not exist!"));
  }

  public void deleteToken(VerificationToken token) {
    repository.deleteById(token.getId());
  }
}
