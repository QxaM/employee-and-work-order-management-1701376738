package org.maxq.authorization.repository;

import org.maxq.authorization.domain.VerificationToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends CrudRepository<VerificationToken, Long> {

  Optional<VerificationToken> findByToken(String token);
}
