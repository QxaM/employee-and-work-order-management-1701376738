package org.maxq.taskservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.maxq.taskservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class TaskServiceTest {

  private static final String TASK_NOT_FOUND_MESSAGE = "Task with given id does not exist! ID: %s";

  private User user;
  private Task task;

  @Autowired
  private TaskService taskService;

  @MockitoBean
  private TaskRepository taskRepository;

  @BeforeEach
  void createData() {
    user = new User(1L, "test@test.com", Collections.emptySet());
    task = new Task(1L, "Test", "Test task description", user);
  }

  @Test
  void shouldCreateTask() throws UserDoesNotExistException {
    // Given
    when(taskRepository.save(task)).thenReturn(task);

    // When
    Task savedTask = taskService.createTask(task);

    // Then
    assertAll(
        () -> assertEquals(task.getId(), savedTask.getId(),
            "Wrong task saved - incorrect ID"),
        () -> assertEquals(task.getTitle(), savedTask.getTitle(),
            "Wrong task saved - incorrect title"),
        () -> assertEquals(task.getDescription(), savedTask.getDescription(),
            "Wrong task saved - incorrect description"),
        () -> assertEquals(task.getUser().getId(), savedTask.getUser().getId(),
            "Wrong task saved - incorrect user ID"),
        () -> assertEquals(task.getUser().getEmail(), savedTask.getUser().getEmail(),
            "Wrong task saved - incorrect user ID")
    );
    verify(taskRepository, times(1)).save(task);
  }

  @Test
  void createTaskShouldThrow_When_InvalidDataAccessApiUsageException() {
    // Given
    String expectedMessage
        = "Failed to create task. User with id: " + user.getId() + " does not exist!";
    when(taskRepository.save(task)).thenThrow(InvalidDataAccessApiUsageException.class);

    // When
    Executable executable = () -> taskService.createTask(task);

    // Then
    UserDoesNotExistException exception
        = assertThrows(UserDoesNotExistException.class, executable,
        "Service should not throw on correct save");
    assertEquals(expectedMessage, exception.getMessage(), "Wrong message was throw from service");
  }

  @Test
  void createTaskShouldThrow_When_JpaObjectRetrievalFailureException() {
    // Given
    String expectedMessage
        = "Failed to create task. User with id: " + user.getId() + " does not exist!";
    when(taskRepository.save(task)).thenThrow(JpaObjectRetrievalFailureException.class);

    // When
    Executable executable = () -> taskService.createTask(task);

    // Then
    UserDoesNotExistException exception
        = assertThrows(UserDoesNotExistException.class, executable,
        "Service should not throw on correct save");
    assertEquals(expectedMessage, exception.getMessage(), "Wrong message was throw from service");
  }

  @Test
  void shouldGetTask() throws ElementNotFoundException {
    // Given
    when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));

    // When
    Task foundTask = taskService.getTask(task.getId());

    // Then
    assertAll(
        () -> assertEquals(task.getId(), foundTask.getId(), "Found ID should match"),
        () -> assertEquals(task.getTitle(), foundTask.getTitle(), "Found title should match"),
        () -> assertEquals(task.getDescription(), foundTask.getDescription(),
            "Found description should match"),
        () -> assertEquals(task.getUser().getId(), foundTask.getUser().getId(),
            "Found user should match")
    );
  }

  @Test
  void getShouldThrow_When_FoundEmpty() {
    // Given
    String expectedMessage = TASK_NOT_FOUND_MESSAGE.formatted(task.getId());
    when(taskRepository.findById(task.getId())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> taskService.getTask(task.getId());

    // Then
    ElementNotFoundException exception
        = assertThrows(ElementNotFoundException.class, executable, "Service should throw on empty");
    assertEquals(expectedMessage, exception.getMessage(), "Wrong message was throw from service");
  }

  @Test
  void getAllTasks() {
    // Given
    Task task1 = new Task(2L, "Test", "Test task description", user);

    when(taskRepository.findAll()).thenReturn(List.of(task, task1));

    // When
    List<Task> foundTasks = taskService.getAllTasks();

    // Then
    assertEquals(2, foundTasks.size(), "Wrong number of tasks found");
    assertAll(
        () -> assertTrue(
            foundTasks.stream().anyMatch(foundTask -> task.getId().equals(foundTask.getId()))),
        () -> assertTrue(
            foundTasks.stream().anyMatch(foundTask -> task1.getId().equals(foundTask.getId())))
    );
  }

  @Test
  void getAllTasksEmpty_When_ReturnedEmpty() {
    // Given
    when(taskRepository.findAll()).thenReturn(Collections.emptyList());

    // When
    List<Task> foundTasks = taskService.getAllTasks();

    // Then
    assertTrue(foundTasks.isEmpty(), "Wrong number of tasks found - tasks should be empty");
  }

  @Test
  void updateTask() throws ElementNotFoundException, UserDoesNotExistException {
    // Given
    User newUser = new User(2L, "test1@test.com", Collections.emptySet());
    Task newTask = new Task(task.getId(), "Updated", "Test task updated", newUser);
    when(taskRepository.findById(newTask.getId())).thenReturn(Optional.of(task));
    when(taskRepository.save(any(Task.class))).thenReturn(newTask);

    // When
    Task updatedTask = taskService.updateTask(newTask);

    // Then
    assertAll(
        () -> assertEquals(newTask.getId(), updatedTask.getId(),
            "Wrong task saved - incorrect ID"),
        () -> assertEquals(newTask.getTitle(), updatedTask.getTitle(),
            "Wrong task saved - incorrect title"),
        () -> assertEquals(newTask.getDescription(), updatedTask.getDescription(),
            "Wrong task saved - incorrect description"),
        () -> assertEquals(newTask.getUser().getId(), updatedTask.getUser().getId(),
            "Wrong task saved - incorrect user ID"),
        () -> assertEquals(newTask.getUser().getEmail(), updatedTask.getUser().getEmail(),
            "Wrong task saved - incorrect user ID")
    );
    assertAll(
        () -> verify(taskRepository, times(1)).save(
            argThat(savedTask -> newTask.getId().equals(savedTask.getId()))
        ),
        () -> verify(taskRepository, times(1)).save(
            argThat(savedTask -> newTask.getTitle().equals(savedTask.getTitle()))
        ),
        () -> verify(taskRepository, times(1)).save(
            argThat(savedTask -> newTask.getDescription().equals(savedTask.getDescription()))
        ),
        () -> verify(taskRepository, times(1)).save(
            argThat(savedTask -> newTask.getUser().getId().equals(savedTask.getUser().getId()))
        ),
        () -> verify(taskRepository, times(1)).save(
            argThat(
                savedTask -> newTask.getUser().getEmail().equals(savedTask.getUser().getEmail()))
        )
    );
  }

  @Test
  void updateTaskShouldThrow_When_NoTaskToUpdate() {
    // Given
    String expectedMessage = TASK_NOT_FOUND_MESSAGE.formatted(task.getId());
    User newUser = new User(2L, "test1@test.com", Collections.emptySet());
    Task newTask = new Task(task.getId(), "Updated", "Test task updated", newUser);
    when(taskRepository.findById(newTask.getId())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> taskService.updateTask(newTask);

    // Then
    ElementNotFoundException exception = assertThrows(ElementNotFoundException.class, executable,
        "Service should throw when task does not exist");
    assertEquals(expectedMessage, exception.getMessage(), "Wrong message was throw from service");
  }

  @Test
  void updateTaskShouldThrow_When_NoUserToUpdate() {
    // Given
    User newUser = new User(2L, "test1@test.com", Collections.emptySet());
    Task newTask = new Task(task.getId(), "Updated", "Test task updated", newUser);
    String expectedMessage
        = "Failed to create task. User with id: " + newUser.getId() + " does not exist!";

    when(taskRepository.findById(newTask.getId())).thenReturn(Optional.of(task));
    when(taskRepository.save(any(Task.class))).thenThrow(JpaObjectRetrievalFailureException.class);

    // When
    Executable executable = () -> taskService.updateTask(newTask);

    // Then
    UserDoesNotExistException exception = assertThrows(UserDoesNotExistException.class, executable,
        "Service should throw when task does not exist");
    assertEquals(expectedMessage, exception.getMessage(), "Wrong message was throw from service");
  }

  @Test
  void deleteTask() {
    // Given
    when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
    doNothing().when(taskRepository).deleteById(task.getId());

    // When
    Executable executable = () -> taskService.deleteTask(task.getId());

    // Then
    assertDoesNotThrow(executable, "Service should not throw on correct delete");
    verify(taskRepository, times(1)).deleteById(task.getId());
  }

  @Test
  void deleteTaskShouldThrow_When_TaskNotFound() {
    // Given
    String expectedMessage = TASK_NOT_FOUND_MESSAGE.formatted(task.getId());
    when(taskRepository.findById(task.getId())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> taskService.deleteTask(task.getId());

    // Then
    Exception exception = assertThrows(ElementNotFoundException.class, executable,
        "Service should throw when task does not exist");
    assertEquals(expectedMessage, exception.getMessage(), "Wrong message was throw from service");
  }
}