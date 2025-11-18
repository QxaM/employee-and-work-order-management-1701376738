package org.maxq.taskservice.repository;

import org.maxq.taskservice.domain.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
}
