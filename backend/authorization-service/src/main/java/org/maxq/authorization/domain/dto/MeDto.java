package org.maxq.authorization.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MeDto {

  private String email;
  private List<RoleDto> roles;
}
