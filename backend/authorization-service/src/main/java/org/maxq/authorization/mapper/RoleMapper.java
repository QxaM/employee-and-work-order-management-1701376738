package org.maxq.authorization.mapper;

import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.dto.RoleDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleMapper {

  public RoleDto mapToRoleDto(Role role) {
    return new RoleDto(role.getId(), role.getName());
  }

  public List<RoleDto> mapToRoleDtoList(List<Role> roles) {
    return roles.stream().map(this::mapToRoleDto).toList();
  }
}
