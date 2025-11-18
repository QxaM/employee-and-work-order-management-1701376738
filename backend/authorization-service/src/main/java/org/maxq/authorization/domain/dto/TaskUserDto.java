package org.maxq.authorization.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TaskUserDto {

  private Long id;
  private String email;
  private List<RoleDto> roles;
}
