package org.maxq.profileservice.repository;

import org.maxq.profileservice.domain.Profile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends CrudRepository<Profile, Long> {
  Optional<Profile> findByEmail(String email);
}
