package org.maxq.authorization.repository;

import jakarta.annotation.Nonnull;
import org.maxq.authorization.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

  Optional<User> findByEmail(String email);

  @Override
  @Nonnull
  List<User> findAll();
}
