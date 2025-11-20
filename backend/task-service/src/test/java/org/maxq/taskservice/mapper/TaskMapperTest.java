package org.maxq.taskservice.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.Role;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaskMapperTest {

  @Autowired
  private TaskMapper taskMapper;

  @Test
  void shouldMapToTask() {
    // Given
    RoleDto roleDto = new RoleDto(1L, "ROLE_TEST");
    UserDto userDto = new UserDto(2L, "test@test.com", List.of(roleDto));
    TaskDto taskDto = new TaskDto(3L, "Title", "Test description", userDto);

    // When
    Task task = taskMapper.mapToTask(taskDto);

    // Then
    assertAll(
        () -> assertEquals(taskDto.getId(), task.getId(), "ID not mapped correctly"),
        () -> assertEquals(taskDto.getTitle(), task.getTitle(), "Title not mapped correctly"),
        () -> assertEquals(taskDto.getDescription(), task.getDescription(),
            "Description not mapped correctly")
    );

    User user = task.getUser();
    assertAll(
        () -> assertEquals(userDto.getId(), user.getId(), "User ID not mapped correctly"),
        () -> assertEquals(userDto.getEmail(), user.getEmail(), "User email not mapped correctly")
    );

    List<Role> roles = user.getRoles().stream().toList();
    assertEquals(1, roles.size(), "Role size not match - not mapped correctly");
    assertAll(
        () -> assertEquals(roleDto.getId(), roles.getFirst().getId(),
            "Role ID not mapped correctly"),
        () -> assertEquals(roleDto.getName(), roles.getFirst().getName(),
            "Role Name not mapped correctly")
    );
  }

  @Test
  void shouldMapToTaskDto() {
    // Given
    Role role = new Role(1L, "ROLE_TEST");
    User user = new User(2L, "test@test.com", Set.of(role));
    Task task = new Task(3L, "Title", "Test description", user);

    // When
    TaskDto taskDto = taskMapper.mapToTaskDto(task);

    // Then
    assertAll(
        () -> assertEquals(task.getId(), taskDto.getId(), "ID not mapped correctly"),
        () -> assertEquals(task.getTitle(), taskDto.getTitle(), "Title not mapped correctly"),
        () -> assertEquals(task.getDescription(), taskDto.getDescription(),
            "Description not mapped correctly")
    );

    UserDto userDto = taskDto.getUser();
    assertAll(
        () -> assertEquals(user.getId(), userDto.getId(), "User ID not mapped correctly"),
        () -> assertEquals(user.getEmail(), userDto.getEmail(), "User email not mapped correctly")
    );

    List<RoleDto> roleDtos = userDto.getRoles();
    assertEquals(1, roleDtos.size(), "Role size not match - not mapped correctly");
    assertAll(
        () -> assertEquals(role.getId(), roleDtos.getFirst().getId(),
            "Role ID not mapped correctly"),
        () -> assertEquals(role.getName(), roleDtos.getFirst().getName(),
            "Role Name not mapped correctly")
    );
  }

  @Test
  void shouldMapToTaskDtoList() {
    // Given
    Role role = new Role(1L, "ROLE_TEST");
    User user = new User(2L, "test@test.com", Set.of(role));
    Task task1 = new Task(3L, "Title 1", "Test description 1", user);
    Task task2 = new Task(4L, "Title 2", "Test description 2", user);

    // When
    List<TaskDto> taskDtoList = taskMapper.mapToTaskDtoList(List.of(task1, task2));

    // Then
    assertEquals(2, taskDtoList.size());
    assertAll(
        () -> assertTrue(
            taskDtoList.stream().anyMatch(foundTask -> task1.getId().equals(foundTask.getId()))),
        () -> assertTrue(
            taskDtoList.stream().anyMatch(foundTask -> task2.getId().equals(foundTask.getId())))
    );
  }
}