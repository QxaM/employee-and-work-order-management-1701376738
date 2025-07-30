package org.maxq.authorization.repository;

import jakarta.annotation.Nonnull;
import org.maxq.authorization.domain.Role;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Long> {

  Optional<Role> findByName(String name);

  @Override
  @Nonnull
  List<Role> findAll();
}
