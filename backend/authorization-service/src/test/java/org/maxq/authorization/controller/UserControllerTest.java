package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.PageDto;
import org.maxq.authorization.domain.dto.RoleDto;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.RoleAlreadyExistsException;
import org.maxq.authorization.domain.exception.RoleDoesNotExistException;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
@WebAppConfiguration
class UserControllerTest {

  private static final String URL = "/users";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;
  @MockitoBean
  private UserService userService;
  @MockitoBean
  private UserMapper userMapper;
  @MockitoBean
  private JwtDecoder jwtDecoder;

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

    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "RS256")
        .subject("robot")
        .issuer("api-gateway-service")
        .claim("type", "access_token")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();
    when(jwtDecoder.decode("test-token")).thenReturn(jwt);
  }

  @Test
  void shouldGetAllUsers() throws Exception {
    // Given
    Pageable page = Pageable.ofSize(10).withPage(0);
    RoleDto roleDto = new RoleDto(role.getId(), role.getName());
    List<GetUserDto> userDtos = List.of(
        new GetUserDto(user1.getId(), user1.getEmail(), user1.isEnabled(), List.of(roleDto)),
        new GetUserDto(user2.getId(), user2.getEmail(), user2.isEnabled(), List.of(roleDto))
    );
    Page<User> usersPage = new PageImpl<>(users, page, users.size());
    PageDto<GetUserDto> usersDtoPage = PageDto.<GetUserDto>builder()
        .content(userDtos)
        .first(true)
        .last(true)
        .number(0)
        .numberOfElements(2)
        .size(10)
        .totalElements(users.size())
        .totalPages(1)
        .empty(false)
        .build();
    when(userService.getAllUsers(anyInt(), anyInt())).thenReturn(usersPage);
    when(userMapper.mapToGetUserDtoPage(any())).thenReturn(usersDtoPage);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN"))
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
  void shouldThrow_When_UserIsNotAdmin() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_OPERATOR"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Forbidden: You don't have permission to access this resource")));
  }

  @Test
  void shouldThrow_When_TokenIsNotPresent_GetUsers() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN"))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldAddRole() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doNothing().when(userService).addRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/addRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, times(1))
        .addRole(
            argThat(user -> user.getId().equals(user1.getId())),
            argThat(roleId -> roleId.equals(role.getId())));
  }

  @Test
  void shouldThrow_NotFound_WhenUserNotFound() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenThrow(ElementNotFoundException.class);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/addRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isNotFound());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, never()).addRole(any(User.class), anyLong());
  }

  @Test
  void shouldThrow_NotFound_WhenRoleNotFound() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doThrow(ElementNotFoundException.class).when(userService)
        .addRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/addRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isNotFound());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, times(1))
        .addRole(
            argThat(user -> user.getId().equals(user1.getId())),
            argThat(roleId -> roleId.equals(role.getId())));
  }

  @Test
  void shouldThrow_RoleExists_WhenRoleExists() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doThrow(RoleAlreadyExistsException.class).when(userService)
        .addRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/addRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, times(1))
        .addRole(
            argThat(user -> user.getId().equals(user1.getId())),
            argThat(roleId -> roleId.equals(role.getId())));
  }

  @Test
  void shouldNotAllowNonAdminRoles() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/addRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_OPERATOR")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isForbidden());
  }

  @Test
  void shouldThrow_When_TokenIsNotPresent_AddRole() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doNothing().when(userService).addRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/addRole")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldRemoveRole() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doNothing().when(userService).removeRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/removeRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, times(1))
        .removeRole(
            argThat(user -> user.getId().equals(user1.getId())),
            argThat(roleId -> roleId.equals(role.getId())));
  }

  @Test
  void shouldThrow_NotFound_WhenUserNotFound_When_RemoveRole() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenThrow(ElementNotFoundException.class);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/removeRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isNotFound());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, never()).removeRole(any(User.class), anyLong());
  }

  @Test
  void shouldThrow_NotFound_WhenRoleNotFound_When_RemoveRole() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doThrow(ElementNotFoundException.class).when(userService)
        .removeRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/removeRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isNotFound());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, times(1))
        .removeRole(
            argThat(user -> user.getId().equals(user1.getId())),
            argThat(roleId -> roleId.equals(role.getId())));
  }

  @Test
  void shouldThrow_RoleNotExists_WhenRoleNotFound() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doThrow(RoleDoesNotExistException.class).when(userService)
        .removeRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/removeRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    verify(userService, times(1)).getUserById(user1.getId());
    verify(userService, times(1))
        .removeRole(
            argThat(user -> user.getId().equals(user1.getId())),
            argThat(roleId -> roleId.equals(role.getId())));
  }

  @Test
  void shouldNotAllowNonAdminRoles_When_RemoveRole() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/removeRole")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_OPERATOR")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isForbidden());
  }

  @Test
  void shouldThrow_When_TokenIsNotPresent_RemoveRole() throws Exception {
    // Given
    when(userService.getUserById(anyLong())).thenReturn(user1);
    doNothing().when(userService).removeRole(any(User.class), anyLong());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/" + user1.getId() + "/removeRole")
            .header("X-User", "test@test.com")
            .header("X-User-Roles", "ROLE_ADMIN")
            .param("role", String.valueOf(role.getId())))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }
}