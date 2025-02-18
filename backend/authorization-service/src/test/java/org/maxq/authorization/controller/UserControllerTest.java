package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.RoleDto;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
@WebAppConfiguration
class UserControllerTest {

  private static final String URL = "/users";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;
  @MockBean
  private UserService userService;
  @MockBean
  private UserMapper userMapper;

  private Role role;
  private User user1;
  private User user2;
  private List<User> users;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();

    role = new Role(1L, "ADMIN", List.of());
    user1 = new User(1L, "test1@test.com", "test1", true, Set.of(role));
    user2 = new User(2L, "test2@test.com", "test2", true, Set.of(role));
    users = List.of(user1, user2);
  }

  @Test
  @WithMockUser(username = "test@test.com", roles = "ADMIN")
  void shouldGetAllUsers() throws Exception {
    // Given
    Pageable page = Pageable.ofSize(10).withPage(0);
    RoleDto roleDto = new RoleDto(role.getId(), role.getName());
    List<GetUserDto> userDtos = List.of(
        new GetUserDto(user1.getId(), user1.getEmail(), user1.isEnabled(), List.of(roleDto)),
        new GetUserDto(user2.getId(), user2.getEmail(), user2.isEnabled(), List.of(roleDto))
    );
    Page<User> usersPage = new PageImpl<>(users, page, users.size());
    Page<GetUserDto> usersDtoPage = new PageImpl<>(userDtos, page, userDtos.size());
    when(userService.getAllUsers(anyInt(), anyInt())).thenReturn(usersPage);
    when(userMapper.mapToGetUserDtoPage(any())).thenReturn(usersDtoPage);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.content", Matchers.hasSize(2)))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.content[0].id", Matchers.is(user1.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.content[1].id", Matchers.is(user2.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalElements", Matchers.is(users.size())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalPages", Matchers.is(1)));
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