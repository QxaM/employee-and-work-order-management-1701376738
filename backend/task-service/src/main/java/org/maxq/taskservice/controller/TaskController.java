package org.maxq.taskservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.taskservice.controller.api.TaskApi;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.maxq.taskservice.mapper.TaskMapper;
import org.maxq.taskservice.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@PreAuthorize("authentication.principal != null")
public class TaskController implements TaskApi {

  private final TaskService taskService;
  private final TaskMapper taskMapper;

  @Override
  @PostMapping
  public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto task)
      throws UserDoesNotExistException {
    Task mappedTask = taskMapper.mapToTask(task);
    Task createdTask = taskService.createTask(mappedTask);
    TaskDto mappedCreatedTask = taskMapper.mapToTaskDto(createdTask);
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(mappedCreatedTask);
  }

  @Override
  @PutMapping
  public ResponseEntity<TaskDto> updateTask(@RequestBody TaskDto task)
      throws UserDoesNotExistException, ElementNotFoundException {
    Task mappedTask = taskMapper.mapToTask(task);
    Task updatedTask = taskService.updateTask(mappedTask);
    TaskDto mappedUpdatedTask = taskMapper.mapToTaskDto(updatedTask);
    return ResponseEntity.ok(mappedUpdatedTask);
  }

  @Override
  @GetMapping
  public ResponseEntity<List<TaskDto>> getAllTasks() {
    List<Task> tasks = taskService.getAllTasks();
    List<TaskDto> mappedTasks = taskMapper.mapToTaskDtoList(tasks);
    return ResponseEntity.ok(mappedTasks);
  }

  @Override
  @DeleteMapping("/{taskId}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long taskId)
      throws ElementNotFoundException {
    taskService.deleteTask(taskId);
    return ResponseEntity.noContent().build();
  }
}
