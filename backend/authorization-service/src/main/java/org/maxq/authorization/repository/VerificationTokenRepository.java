package org.maxq.authorization.repository;

import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends CrudRepository<VerificationToken, Long> {

  Optional<VerificationToken> findByToken(String token);

  List<VerificationToken> findAllByUser(User user);
}
