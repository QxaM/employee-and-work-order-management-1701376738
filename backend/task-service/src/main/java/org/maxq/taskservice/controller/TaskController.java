package org.maxq.taskservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.taskservice.controller.api.TaskApi;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.maxq.taskservice.mapper.TaskMapper;
import org.maxq.taskservice.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController implements TaskApi {

  private final TaskService taskService;
  private final TaskMapper taskMapper;

  @Override
  @PostMapping
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<Void> createTask(@RequestBody TaskDto task)
      throws UserDoesNotExistException {
    Task mappedTask = taskMapper.mapToTask(task);
    taskService.createTask(mappedTask);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}
