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

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

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
}