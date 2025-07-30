package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.RoleApi;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.dto.RoleDto;
import org.maxq.authorization.mapper.RoleMapper;
import org.maxq.authorization.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController implements RoleApi {

  private final RoleService roleService;
  private final RoleMapper roleMapper;

  @Override
  @GetMapping
  public ResponseEntity<List<RoleDto>> getRoles() {
    List<Role> roles = roleService.getAllRoles();
    return ResponseEntity.ok(
        roleMapper.mapToRoleDtoList(roles)
    );
  }
}
