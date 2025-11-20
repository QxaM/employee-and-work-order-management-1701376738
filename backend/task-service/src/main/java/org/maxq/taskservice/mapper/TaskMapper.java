package org.maxq.taskservice.mapper;

import lombok.RequiredArgsConstructor;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskMapper {

  private final UserMapper userMapper;

  public Task mapToTask(TaskDto taskDto) {
    return new Task(
        taskDto.getId(),
        taskDto.getTitle(),
        taskDto.getDescription(),
        userMapper.mapToUser(taskDto.getUser())
    );
  }

  public TaskDto mapToTaskDto(Task task) {
    return new TaskDto(
        task.getId(),
        task.getTitle(),
        task.getDescription(),
        userMapper.mapToUserDto(task.getUser())
    );
  }
}
