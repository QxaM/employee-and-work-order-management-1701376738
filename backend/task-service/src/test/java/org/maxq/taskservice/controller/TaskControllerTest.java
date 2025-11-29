package org.maxq.taskservice.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.Role;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.PageDto;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.maxq.taskservice.mapper.TaskMapper;
import org.maxq.taskservice.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
import java.util.Collections;
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

  private UserDto userDto;
  private TaskDto taskDto;

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

    RoleDto roleDto = new RoleDto(1L, ROLES);
    userDto = new UserDto(10L, EMAIL, List.of(roleDto));
    taskDto = new TaskDto(100L, "Test", "Test description", userDto);

    Role role = new Role(roleDto.getId(), roleDto.getName());
    user = new User(userDto.getId(), userDto.getEmail(), Set.of(role));
    task = new Task(taskDto.getId(), taskDto.getTitle(), taskDto.getDescription(), user);
  }

  @Test
  void shouldCreateTask() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.createTask(task)).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(taskDto.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.title", Matchers.is(taskDto.getTitle())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.description",
            Matchers.is(taskDto.getDescription()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.id",
            Matchers.is(taskDto.getUser().getId().intValue()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.email",
            Matchers.is(taskDto.getUser().getEmail()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles",
            Matchers.hasSize(taskDto.getUser().getRoles().size()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles[0].id",
            Matchers.is(taskDto.getUser().getRoles().getFirst().getId().intValue()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles[0].name",
            Matchers.is(taskDto.getUser().getRoles().getFirst().getName()))
        );
    verify(taskService, times(1)).createTask(task);
  }

  @Test
  void createTask_ShouldReturn400_When_UserDoesNotExist() throws Exception {
    // Given
    String message = "Test message";
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.createTask(task)).thenThrow(new UserDoesNotExistException(message));

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
    when(taskService.createTask(task)).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

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
    when(taskService.createTask(task)).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

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

  @Test
  void shouldUpdateTask() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.updateTask(task)).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(taskDto.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.title", Matchers.is(taskDto.getTitle())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.description",
            Matchers.is(taskDto.getDescription()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.id",
            Matchers.is(taskDto.getUser().getId().intValue()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.email",
            Matchers.is(taskDto.getUser().getEmail()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles",
            Matchers.hasSize(taskDto.getUser().getRoles().size()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles[0].id",
            Matchers.is(taskDto.getUser().getRoles().getFirst().getId().intValue()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles[0].name",
            Matchers.is(taskDto.getUser().getRoles().getFirst().getName()))
        );
    verify(taskService, times(1)).updateTask(task);
  }

  @Test
  void updateTask_ShouldReturn400_When_UserDoesNotExist() throws Exception {
    // Given
    String message = "Test message";
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.updateTask(task)).thenThrow(new UserDoesNotExistException(message));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
    verify(taskService, times(1)).updateTask(task);
  }

  @Test
  void updateTask_ShouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.updateTask(task)).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL)
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(UNAUTHORIZED_MESSAGE)));
    verify(taskService, times(0)).updateTask(any());
  }

  @Test
  void updateTask_ShouldReturn403_When_NoUserHeaders() throws Exception {
    // Given
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.updateTask(task)).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(FORBIDDEN_MESSAGE)));
    verify(taskService, times(0)).updateTask(any());
  }

  @Test
  void updateTask_ShouldReturn404_When_TaskDoesNotExist() throws Exception {
    // Given
    String message = "Test message";
    when(taskMapper.mapToTask(any(TaskDto.class))).thenReturn(task);
    when(taskService.updateTask(task)).thenThrow(new ElementNotFoundException(message));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES)
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(taskDto)))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
    verify(taskService, times(1)).updateTask(task);
  }

  @Test
  void shouldGetAllTasks() throws Exception {
    // Given
    Task task1 = new Task(101L, "Test 1", "Test description 1", user);
    TaskDto taskDto1
        = new TaskDto(task1.getId(), task1.getTitle(), task1.getDescription(), userDto);

    Pageable pageable = Pageable.ofSize(10).withPage(0);
    List<Task> tasks = List.of(task, task1);
    Page<Task> pageTask = new PageImpl<>(tasks, pageable, tasks.size());
    List<TaskDto> taskDtos = List.of(taskDto, taskDto1);
    PageDto<TaskDto> taskDtoPage = PageDto.<TaskDto>builder()
        .content(taskDtos)
        .first(true)
        .last(true)
        .number(0)
        .numberOfElements(2)
        .size(10)
        .totalElements(taskDtos.size())
        .totalPages(1)
        .empty(false)
        .build();

    when(taskService.getAllTasks(anyInt(), anyInt())).thenReturn(pageTask);
    when(taskMapper.mapToTaskDtoPage(pageTask)).thenReturn(taskDtoPage);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.content", Matchers.hasSize(taskDtos.size())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.first", Matchers.is(taskDtoPage.isFirst())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.last", Matchers.is(taskDtoPage.isLast())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.empty", Matchers.is(taskDtoPage.isEmpty())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalPages",
            Matchers.is(taskDtoPage.getTotalPages())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.number",
            Matchers.is(taskDtoPage.getNumber())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.size",
            Matchers.is(taskDtoPage.getSize())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalElements",
            Matchers.is((int) taskDtoPage.getTotalElements())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.numberOfElements",
            Matchers.is(taskDtoPage.getNumberOfElements())
        ));
    verify(taskService, times(1)).getAllTasks(anyInt(), anyInt());
  }

  @Test
  void shouldGetAllTasks_When_CustomPagination() throws Exception {
    // Given
    Task task1 = new Task(101L, "Test 1", "Test description 1", user);
    TaskDto taskDto1
        = new TaskDto(task1.getId(), task1.getTitle(), task1.getDescription(), userDto);

    Pageable pageable = Pageable.ofSize(15).withPage(1);
    List<Task> tasks = List.of(task, task1);
    Page<Task> pageTask = new PageImpl<>(tasks, pageable, tasks.size());
    List<TaskDto> taskDtos = List.of(taskDto, taskDto1);
    PageDto<TaskDto> taskDtoPage = PageDto.<TaskDto>builder()
        .content(taskDtos)
        .first(false)
        .last(true)
        .number(1)
        .numberOfElements(taskDtos.size())
        .size(pageable.getPageSize())
        .totalElements(taskDtos.size() + pageable.getPageSize())
        .totalPages(2)
        .empty(false)
        .build();

    when(taskService.getAllTasks(pageable.getPageNumber(), pageable.getPageSize())).thenReturn(
        pageTask);
    when(taskMapper.mapToTaskDtoPage(pageTask)).thenReturn(taskDtoPage);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "?page=" + pageable.getPageNumber() + "&size=" + pageable.getPageSize())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.content", Matchers.hasSize(taskDtos.size())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.first", Matchers.is(taskDtoPage.isFirst())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.last", Matchers.is(taskDtoPage.isLast())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.empty", Matchers.is(taskDtoPage.isEmpty())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalPages",
            Matchers.is(taskDtoPage.getTotalPages())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.number",
            Matchers.is(taskDtoPage.getNumber())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.size",
            Matchers.is(taskDtoPage.getSize())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalElements",
            Matchers.is((int) taskDtoPage.getTotalElements())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.numberOfElements",
            Matchers.is(taskDtoPage.getNumberOfElements())
        ));
    verify(taskService, times(1))
        .getAllTasks(pageable.getPageNumber(), pageTask.getSize());
  }

  @Test
  void shouldGetEmptyList_When_NoTasks() throws Exception {
    // Given
    PageDto<TaskDto> taskDtoPage = PageDto.<TaskDto>builder()
        .content(Collections.emptyList())
        .first(true)
        .last(true)
        .number(0)
        .numberOfElements(0)
        .size(10)
        .totalElements(0)
        .totalPages(1)
        .empty(true)
        .build();

    when(taskService.getAllTasks(anyInt(), anyInt())).thenReturn(Page.empty());
    when(taskMapper.mapToTaskDtoPage(any())).thenReturn(taskDtoPage);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.content", Matchers.hasSize(0)))
        .andExpect(MockMvcResultMatchers.jsonPath("$.first", Matchers.is(taskDtoPage.isFirst())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.last", Matchers.is(taskDtoPage.isLast())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.empty", Matchers.is(taskDtoPage.isEmpty())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalPages",
            Matchers.is(taskDtoPage.getTotalPages())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.number",
            Matchers.is(taskDtoPage.getNumber())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.size",
            Matchers.is(taskDtoPage.getSize())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.totalElements",
            Matchers.is((int) taskDtoPage.getTotalElements())
        ))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.numberOfElements",
            Matchers.is(taskDtoPage.getNumberOfElements())
        ));
    verify(taskService, times(1)).getAllTasks(anyInt(), anyInt());
  }

  @Test
  void getAllTasks_ShouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    Task task1 = new Task(101L, "Test 1", "Test description 1", user);
    TaskDto taskDto1
        = new TaskDto(task1.getId(), task1.getTitle(), task1.getDescription(), userDto);

    List<Task> tasks = List.of(task, task1);
    Page<Task> taskPage = new PageImpl<>(tasks, Pageable.ofSize(10).withPage(0), tasks.size());
    List<TaskDto> taskDtos = List.of(taskDto, taskDto1);

    when(taskService.getAllTasks(anyInt(), anyInt())).thenReturn(taskPage);
    when(taskMapper.mapToTaskDtoList(tasks)).thenReturn(taskDtos);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(UNAUTHORIZED_MESSAGE)));
    verify(taskService, times(0)).getAllTasks(anyInt(), anyInt());
  }

  @Test
  void getAllTasks_ShouldReturn403_When_NoUserHeaders() throws Exception {
    // Given
    Task task1 = new Task(101L, "Test 1", "Test description 1", user);
    TaskDto taskDto1
        = new TaskDto(task1.getId(), task1.getTitle(), task1.getDescription(), userDto);

    List<Task> tasks = List.of(task, task1);
    Page<Task> taskPage = new PageImpl<>(tasks, Pageable.ofSize(10).withPage(0), tasks.size());
    List<TaskDto> taskDtos = List.of(taskDto, taskDto1);

    when(taskService.getAllTasks(anyInt(), anyInt())).thenReturn(taskPage);
    when(taskMapper.mapToTaskDtoList(tasks)).thenReturn(taskDtos);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(FORBIDDEN_MESSAGE)));
    verify(taskService, times(0)).getAllTasks(anyInt(), anyInt());
  }

  @Test
  void shouldGetTask() throws Exception {
    // Given
    when(taskService.getTask(taskDto.getId())).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/" + taskDto.getId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(taskDto.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.title", Matchers.is(taskDto.getTitle())))
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.description",
            Matchers.is(taskDto.getDescription()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.id",
            Matchers.is(taskDto.getUser().getId().intValue()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.email",
            Matchers.is(taskDto.getUser().getEmail()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles",
            Matchers.hasSize(taskDto.getUser().getRoles().size()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles[0].id",
            Matchers.is(taskDto.getUser().getRoles().getFirst().getId().intValue()))
        )
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.user.roles[0].name",
            Matchers.is(taskDto.getUser().getRoles().getFirst().getName()))
        );
    verify(taskService, times(1)).getTask(task.getId());
  }

  @Test
  void getTask_ShouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    when(taskService.getTask(taskDto.getId())).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/" + taskDto.getId())
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(UNAUTHORIZED_MESSAGE)));
    verify(taskService, times(0)).getTask(task.getId());
  }

  @Test
  void getTask_ShouldReturn403_When_NoRobotToken() throws Exception {
    // Given
    when(taskService.getTask(taskDto.getId())).thenReturn(task);
    when(taskMapper.mapToTaskDto(task)).thenReturn(taskDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/" + taskDto.getId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(FORBIDDEN_MESSAGE)));
    verify(taskService, times(0)).getTask(task.getId());
  }

  @Test
  void getTask_ShouldReturn404_When_NoTaskFound() throws Exception {
    // Given
    String message = "Test message";
    when(taskService.getTask(taskDto.getId())).thenThrow(new ElementNotFoundException(message));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/" + taskDto.getId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
    verify(taskService, times(1)).getTask(task.getId());
  }

  @Test
  void shouldDeleteTask() throws Exception {
    // Given
    doNothing().when(taskService).deleteTask(taskDto.getId());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .delete(URL + "/" + taskDto.getId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isNoContent());
    verify(taskService, times(1)).deleteTask(taskDto.getId());
  }

  @Test
  void deleteTask_ShouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    doNothing().when(taskService).deleteTask(taskDto.getId());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .delete(URL + "/" + taskDto.getId())
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(UNAUTHORIZED_MESSAGE)));
    verify(taskService, times(0)).deleteTask(taskDto.getId());
  }

  @Test
  void deleteTask_ShouldReturn403_When_NoUserHeaders() throws Exception {
    // Given
    doNothing().when(taskService).deleteTask(taskDto.getId());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .delete(URL + "/" + taskDto.getId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(FORBIDDEN_MESSAGE)));
    verify(taskService, times(0)).deleteTask(taskDto.getId());
  }

  @Test
  void deleteTask_ShouldReturn404_When_TaskDoesNotExist() throws Exception {
    // Given
    String message = "Test message";
    doThrow(new ElementNotFoundException(message)).when(taskService).deleteTask(taskDto.getId());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .delete(URL + "/" + taskDto.getId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
    verify(taskService, times(1)).deleteTask(taskDto.getId());
  }
}