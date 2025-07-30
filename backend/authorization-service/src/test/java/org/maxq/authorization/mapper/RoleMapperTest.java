package org.maxq.authorization.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.dto.RoleDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class RoleMapperTest {

  @Autowired
  private RoleMapper roleMapper;

  @Test
  void shouldMapToRoleDto() {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());

    // When
    RoleDto roleDto = roleMapper.mapToRoleDto(role);

    // Then
    assertAll(
        () -> assertEquals(role.getId(), roleDto.getId(), "IDs should match after mapping"),
        () -> assertEquals(role.getName(), roleDto.getName(), "Names should match after mapping")
    );
  }

  @Test
  void mapToRoleDtoList() {
    // Given
    Role role1 = new Role(1L, "TEST1", Collections.emptyList());
    Role role2 = new Role(2L, "TEST2", Collections.emptyList());
    List<Role> roles = List.of(role1, role2);

    // When
    List<RoleDto> roleDtoList = roleMapper.mapToRoleDtoList(roles);

    // Then
    assertAll(
        () -> assertEquals(roles.size(), roleDtoList.size(), "Lists sizes should match"),
        () -> assertEquals(roles.getFirst().getId(), roleDtoList.getFirst().getId(),
            "Role IDs should match"),
        () -> assertEquals(roles.get(1).getId(), roleDtoList.get(1).getId(),
            "Role IDs should match")
    );
  }
}