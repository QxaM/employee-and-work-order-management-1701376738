package org.maxq.authorization.repository;

import jakarta.annotation.Nonnull;
import org.maxq.authorization.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository
    extends PagingAndSortingRepository<User, Long>, CrudRepository<User, Long> {

  Optional<User> findByEmail(String email);

  @Override
  @Nonnull
  Page<User> findAll(@Nonnull Pageable pageable);
}
