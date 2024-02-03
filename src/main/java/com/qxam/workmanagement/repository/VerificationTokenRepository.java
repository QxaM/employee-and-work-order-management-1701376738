package com.qxam.workmanagement.repository;

import com.qxam.workmanagement.domain.VerificationToken;
import java.util.Optional;
import java.util.UUID;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends MongoRepository<VerificationToken, ObjectId> {

  Optional<VerificationToken> findByToken(UUID token);
}
