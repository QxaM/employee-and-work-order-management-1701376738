package org.maxq.authorization.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GetUserDto {

  private Long id;
  private String email;
  private boolean enabled;
  private List<RoleDto> roles;
}
