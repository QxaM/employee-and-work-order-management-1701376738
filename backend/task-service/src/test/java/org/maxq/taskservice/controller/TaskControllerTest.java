package org.maxq.taskservice.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.Role;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.maxq.taskservice.mapper.TaskMapper;
import org.maxq.taskservice.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
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

import static org.mockito.Mockito.*;

@SpringBootTest
@WebAppConfiguration
class TaskControllerTest {

  private static final String URL = "/tasks";
  private static final Gson GSON = new Gson();
  private static final String EMAIL = "test@test.com";
  private static final String ROLES = "ROLE_TEST";
  private static final String UNAUTHORIZED_MESSAGE
      = "Unauthorized to access this resource, login please";
  private static final String FORBIDDEN_MESSAGE
      = "Forbidden: You don't have permission to access this resource";

  private final Jwt jwt = Jwt.withTokenValue("test-token")
      .header("alg", "RS256")
      .subject("robot")
      .issuer("api-gateway-service")
      .claim("type", "access_token")
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();

  private MockMvc mockMvc;

  private RoleDto roleDto;
  private UserDto userDto;
  private TaskDto taskDto;

  private Role role;
  private User user;
  private Task task;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockitoBean
  private TaskMapper taskMapper;
  @MockitoBean
  private TaskService taskService;

  @MockitoBean
  private JwtDecoder jwtDecoder;

  @BeforeEach
  void setup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(SecurityMockMvcConfigurers.springSecurity())
        .build();

    when(jwtDecoder.decode("test-token")).thenReturn(jwt);

    roleDto = new RoleDto(1L, ROLES);
    userDto = new UserDto(10L, EMAIL, List.of(roleDto));
    taskDto = new TaskDto(100L, "Test", "Test description", userDto);

    role = new Role(roleDto.getId(), roleDto.getName());
    user = new User(userDto.getId(), userDto.getEmail(), Set.of(role));
    task = new Task(taskDto.getId(), taskDto.getTitle(), taskDto.getDescription(), user);
  }

  @Test
  void shouldCreateTask() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    doNothing().when(taskService).createTask(task);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isCreated());
    verify(taskService, times(1)).createTask(task);
  }

  @Test
  void createTask_ShouldReturn400_When_UserDoesNotExist() throws Exception {
    // Given
    String message = "Test message";
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    doThrow(new UserDoesNotExistException(message)).when(taskService).createTask(task);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
    verify(taskService, times(1)).createTask(task);
  }

  @Test
  void createTask_ShouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    doNothing().when(taskService).createTask(task);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(UNAUTHORIZED_MESSAGE)));
    verify(taskService, times(0)).createTask(any());
  }

  @Test
  void createTask_ShouldReturn403_When_NoUserHeaders() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    doNothing().when(taskService).createTask(task);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(FORBIDDEN_MESSAGE)));
    verify(taskService, times(0)).createTask(any());
  }
}