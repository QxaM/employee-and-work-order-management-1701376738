package org.maxq.taskservice.repository;

import jakarta.annotation.Nonnull;
import org.maxq.taskservice.domain.Task;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TaskRepository extends CrudRepository<Task, Long> {

  @Override
  @Nonnull
  List<Task> findAll();
}
