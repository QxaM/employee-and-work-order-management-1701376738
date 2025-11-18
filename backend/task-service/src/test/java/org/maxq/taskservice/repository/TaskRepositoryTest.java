package org.maxq.taskservice.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaskRepositoryTest {

  private User user;
  private Task task;

  @Autowired
  private TaskRepository taskRepository;

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void createData() {
    user = new User(1L, "test@test.com", Collections.emptySet());
    task = new Task("Test", "Test task description", user);
  }

  @AfterEach
  void cleanAllData() {
    taskRepository.deleteAll();
    userRepository.deleteAll();
  }

  @Test
  void shouldSaveTask() {
    // Given
    userRepository.save(user);

    // When
    taskRepository.save(task);

    // Then
    Optional<Task> optionalTask = taskRepository.findById(task.getId());
    assertTrue(optionalTask.isPresent(), "Task was not created correctly");

    Task foundTask = optionalTask.get();
    assertAll(
        () -> assertEquals(task.getId(), foundTask.getId(), "Id was not saved correctly"),
        () -> assertEquals(task.getTitle(), foundTask.getTitle(), "Title was not saved correctly"),
        () -> assertEquals(task.getDescription(), foundTask.getDescription(),
            "Title was not saved correctly"),
        () -> assertEquals(task.getUser().getId(), foundTask.getUser().getId(),
            "User was not saved correctly - id was not saved correctly"),
        () -> assertEquals(task.getUser().getEmail(), foundTask.getUser().getEmail(),
            "User was not saved correctly - email was not saved correctly")
    );
  }

  @Test
  void saveShouldThrow_When_UserDoesNotExist_And_NoUserSaved() {
    // Given

    // When
    Executable executable = () -> taskRepository.save(task);

    // Then
    assertThrows(InvalidDataAccessApiUsageException.class, executable,
        "Repository should throw when user is not already existing in DB");
  }

  @Test
  void saveShouldThrow_When_UserDoesNotExist() {
    // Given
    userRepository.save(user);

    User user1 = new User(2L, "test1@test.com", Collections.emptySet());
    Task task1 = new Task("Test", "Test task description", user1);

    // When
    Executable executable = () -> taskRepository.save(task1);

    // Then
    assertThrows(InvalidDataAccessApiUsageException.class, executable,
        "Repository should throw when user is not already existing in DB");
  }

  @Test
  void shouldFindById() {
    // Given
    userRepository.save(user);
    taskRepository.save(task);

    // When
    Optional<Task> optionalTask = taskRepository.findById(task.getId());

    // Then
    assertTrue(optionalTask.isPresent(), "Task was not created correctly");

    Task foundTask = optionalTask.get();
    assertAll(
        () -> assertEquals(task.getId(), foundTask.getId(), "Id was not found correctly"),
        () -> assertEquals(task.getTitle(), foundTask.getTitle(), "Title was not found correctly"),
        () -> assertEquals(task.getDescription(), foundTask.getDescription(),
            "Title was not found correctly"),
        () -> assertEquals(task.getUser().getId(), foundTask.getUser().getId(),
            "User was not found correctly - id was not found correctly"),
        () -> assertEquals(task.getUser().getEmail(), foundTask.getUser().getEmail(),
            "User was not found correctly - email was not found correctly")
    );
  }

  @Test
  void shouldFindAllTasks() {
    // Given
    userRepository.save(user);

    Task task1 = new Task("Task 1", "Test task description", user);
    taskRepository.saveAll(List.of(task, task1));

    // When
    List<Task> foundTasks = taskRepository.findAll();

    // Then
    assertEquals(2, foundTasks.size(), "Wrong task count saved and fetched");
    assertAll(
        () -> assertTrue(
            foundTasks.stream().anyMatch(foundTask -> task.getId().equals(foundTask.getId())),
            "Found tasks does not contain correct tasks"),
        () -> assertTrue(
            foundTasks.stream().anyMatch(foundTask -> task1.getId().equals(foundTask.getId())),
            "Found tasks does not contain correct tasks")
    );
  }

  @Test
  void shouldUpdateTask() {
    // Given
    userRepository.save(user);
    taskRepository.save(task);

    Task updatedTask = new Task(task.getId(), "Updated task", "Updated task description", user);

    // When
    taskRepository.save(updatedTask);

    // Then
    Optional<Task> optionalTask = taskRepository.findById(updatedTask.getId());
    assertTrue(optionalTask.isPresent(), "Task was not created correctly");

    Task foundTask = optionalTask.get();
    assertAll(
        () -> assertEquals(updatedTask.getId(), foundTask.getId(), "Id was not found correctly"),
        () -> assertEquals(updatedTask.getTitle(), foundTask.getTitle(),
            "Title was not found correctly"),
        () -> assertEquals(updatedTask.getDescription(), foundTask.getDescription(),
            "Title was not found correctly"),
        () -> assertEquals(updatedTask.getUser().getId(), foundTask.getUser().getId(),
            "User was not found correctly - id was not found correctly"),
        () -> assertEquals(updatedTask.getUser().getEmail(), foundTask.getUser().getEmail(),
            "User was not found correctly - email was not found correctly")
    );
  }

  @Test
  void shouldUpdateTask_With_NewUser() {
    // Given
    userRepository.save(user);
    taskRepository.save(task);

    User newUser = new User(2L, "new@test.com", Collections.emptySet());
    userRepository.save(newUser);

    Task updatedTask = new Task(task.getId(), task.getTitle(), task.getDescription(), newUser);

    // When
    taskRepository.save(updatedTask);

    // Then
    Optional<Task> optionalTask = taskRepository.findById(updatedTask.getId());
    assertTrue(optionalTask.isPresent(), "Task was not created correctly");

    Task foundTask = optionalTask.get();
    assertAll(
        () -> assertEquals(updatedTask.getId(), foundTask.getId(), "Id was not found correctly"),
        () -> assertEquals(updatedTask.getTitle(), foundTask.getTitle(),
            "Title was not found correctly"),
        () -> assertEquals(updatedTask.getDescription(), foundTask.getDescription(),
            "Title was not found correctly"),
        () -> assertEquals(updatedTask.getUser().getId(), foundTask.getUser().getId(),
            "User was not found correctly - id was not found correctly"),
        () -> assertEquals(updatedTask.getUser().getEmail(), foundTask.getUser().getEmail(),
            "User was not found correctly - email was not found correctly")
    );
  }

  @Test
  void updateShouldThrow_When_UserDoesNotExist() {
    // Given
    userRepository.save(user);
    taskRepository.save(task);

    User newUser = new User(2L, "new@test.com", Collections.emptySet());
    Task updatedTask = new Task(task.getId(), task.getTitle(), task.getDescription(), newUser);

    // When
    Executable executable = () -> taskRepository.save(updatedTask);

    // Then
    assertThrows(JpaObjectRetrievalFailureException.class, executable,
        "Repository should throw when user is not already existing in DB");
  }

  @Test
  void shouldDeleteTaskById() {
    // Given
    userRepository.save(user);
    taskRepository.save(task);

    // When
    taskRepository.deleteById(task.getId());

    // Then
    Optional<Task> optionalTask = taskRepository.findById(task.getId());
    assertTrue(optionalTask.isEmpty(), "Task was not deleted correctly");

    Optional<User> optionalUser = userRepository.findById(user.getId());
    assertTrue(optionalUser.isPresent(), "User was deleted alongside task and it should not");
  }
}