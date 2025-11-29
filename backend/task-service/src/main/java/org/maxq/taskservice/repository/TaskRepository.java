package org.maxq.taskservice.repository;

import jakarta.annotation.Nonnull;
import org.maxq.taskservice.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long>,
                                        CrudRepository<Task, Long> {

  @Override
  @Nonnull
  Page<Task> findAll(@Nonnull Pageable pageable);
}
