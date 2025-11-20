package org.maxq.taskservice.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {

  private Long id;
  private String title;
  private String description;
  private UserDto user;
}
