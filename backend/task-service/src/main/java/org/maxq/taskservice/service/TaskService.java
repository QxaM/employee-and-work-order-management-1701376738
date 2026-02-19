package org.maxq.taskservice.service;

import lombok.RequiredArgsConstructor;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.maxq.taskservice.repository.TaskRepository;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

  private static final String TASK_NOT_FOUND_MESSAGE = "Task with given id does not exist! ID: %s";

  private final TaskRepository taskRepository;

  public Task createTask(Task task) throws UserDoesNotExistException {
    try {
      return taskRepository.save(task);
    } catch (InvalidDataAccessApiUsageException | JpaObjectRetrievalFailureException e) {
      throw new UserDoesNotExistException(
          "Failed to create task. User with id: " + task.getUser().getId() + " does not exist!", e);
    }
  }

  public Task getTask(Long taskId) throws ElementNotFoundException {
    Optional<Task> task = taskRepository.findById(taskId);
    return task.orElseThrow(
        () -> new ElementNotFoundException(TASK_NOT_FOUND_MESSAGE.formatted(taskId)));
  }

  public Page<Task> getAllTasks(int page, int size) {
    Pageable pageable = Pageable.ofSize(size).withPage(page);
    return taskRepository.findAll(pageable);
  }

  public Task updateTask(Task task) throws ElementNotFoundException, UserDoesNotExistException {
    Optional<Task> optionalTask = taskRepository.findById(task.getId());
    Task foundTask = optionalTask.orElseThrow(
        () -> new ElementNotFoundException(TASK_NOT_FOUND_MESSAGE.formatted(task.getId())));
    Task taskToUpdate = new Task(
        foundTask.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getUser());

    try {
      return taskRepository.save(taskToUpdate);
    } catch (InvalidDataAccessApiUsageException | JpaObjectRetrievalFailureException e) {
      throw new UserDoesNotExistException(
          "Failed to create task. User with id: " + task.getUser().getId() + " does not exist!", e);
    }
  }

  public void deleteTask(Long taskId) throws ElementNotFoundException {
    Optional<Task> optionalTask = taskRepository.findById(taskId);
    Task foundTask = optionalTask.orElseThrow(
        () -> new ElementNotFoundException(TASK_NOT_FOUND_MESSAGE.formatted(taskId)));
    taskRepository.deleteById(foundTask.getId());
  }
}
