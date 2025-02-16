package org.maxq.authorization.repository;

import org.maxq.authorization.domain.Role;
import org.springframework.data.repository.CrudRepository;

public interface RoleRepository extends CrudRepository<Role, Long> {
}
