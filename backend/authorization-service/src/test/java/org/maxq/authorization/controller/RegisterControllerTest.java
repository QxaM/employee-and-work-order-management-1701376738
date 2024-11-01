package org.maxq.authorization.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EmptySource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@WebAppConfiguration
class RegisterControllerTest {

  private static final String URL = "/register";
  private static final String EMPTY_EMAIL_MESSAGE = "Email cannot be empty";
  private static final String EMPTY_PASSWORD_MESSAGE = "Password cannot be empty";
  private static final String PASSWORD_TOO_SHORT_MESSAGE =
      "The password have to be at least 4 characters long";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;
  @MockBean
  private UserService userService;
  @MockBean
  private UserMapper userMapper;

  @BeforeEach
  void securitySetup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();
  }

  @Test
  void shouldRegisterUser() throws Exception {
    // Given
    UserDto userDto = new UserDto(null, "test@test.com", "test");
    User user = new User("test@test.com", "test");
    when(userMapper.mapToUser(userDto)).thenReturn(user);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andExpect(MockMvcResultMatchers.status().isCreated());
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldReturnValidationError_WhenEmailEmptyOrNull(String email) throws Exception {
    // Given
    UserDto userDto = new UserDto(null, email, "test");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(EMPTY_EMAIL_MESSAGE)));
  }

  @ParameterizedTest
  @NullSource
  void shouldReturnValidationError_WhenPasswordNull(String password) throws Exception {
    // Given
    UserDto userDto = new UserDto(null, "test@test.com", password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(EMPTY_PASSWORD_MESSAGE)));
  }

  @ParameterizedTest
  @EmptySource
  @ValueSource(strings = {"1"})
  void shouldReturnValidationError_WhenPasswordTooShort(String password) throws Exception {
    // Given
    UserDto userDto = new UserDto(null, "test@test.com", password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(PASSWORD_TOO_SHORT_MESSAGE)));
  }

  @Test
  void shouldReturnDuplicationError_WhenUserAlreadyExists() throws Exception {
    // Given
    UserDto userDto = new UserDto(null, "test@test.com", "test");
    User user = new User("test@test.com", "test");
    when(userMapper.mapToUser(userDto)).thenReturn(user);
    doThrow(new DuplicateEmailException("Test message", new Exception())).when(userService).createUser(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }

  @Test
  void shouldReturnValidationError_WhenDBValidationError() throws Exception {
    // Given
    UserDto userDto = new UserDto(null, "test@test.com", "test");
    User user = new User("test@test.com", "test");
    when(userMapper.mapToUser(userDto)).thenReturn(user);
    doThrow(new DataValidationException("Test message", new Exception())).when(userService).createUser(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }
}