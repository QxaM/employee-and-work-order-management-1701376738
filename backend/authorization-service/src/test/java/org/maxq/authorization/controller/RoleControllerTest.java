package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.dto.RoleDto;
import org.maxq.authorization.mapper.RoleMapper;
import org.maxq.authorization.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
@WebAppConfiguration
class RoleControllerTest {

  private static final String URL = "/roles";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockBean
  private RoleService roleService;
  @MockBean
  private RoleMapper roleMapper;

  private Role role1;
  private Role role2;
  private List<Role> roles;
  private List<RoleDto> roleDtos;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();

    role1 = new Role(1L, "TEST1", Collections.emptyList());
    role2 = new Role(2L, "TEST2", Collections.emptyList());
    roles = List.of(role1, role2);
    RoleDto roleDto1 = new RoleDto(role1.getId(), role1.getName());
    RoleDto roleDto2 = new RoleDto(role2.getId(), role2.getName());
    roleDtos = List.of(roleDto1, roleDto2);
  }

  @Test
  @WithMockUser(username = "test@test.com", roles = "ADMIN")
  void shouldReturnAllRoles() throws Exception {
    // Given
    when(roleService.getAllRoles()).thenReturn(roles);
    when(roleMapper.mapToRoleDtoList(anyList())).thenReturn(roleDtos);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(2)))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$[0].id", Matchers.is(role1.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$[1].id", Matchers.is(role2.getId().intValue())));
  }

  @Test
  @WithMockUser(username = "test@test.com", roles = "OPERATOR")
  void shouldThrow_When_UserIsNotAdmin() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Forbidden: You don't have permission to access this resource")));
  }
}