package org.maxq.authorization.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.maxq.authorization.config.MockitoPublisherConfiguration;
import org.maxq.authorization.domain.Profile;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.event.OnRegisterVerificationFail;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.mapper.ProfileMapper;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.RoleService;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@WebAppConfiguration
@Import(MockitoPublisherConfiguration.class)
class RegisterControllerTest {

  private static final String URL = "/register";
  private static final String CONFIRM_URL = "/register/confirm";
  private static final String EMPTY_FIRST_NAME_MESSAGE = "First name cannot be empty";
  private static final String EMPTY_LAST_NAME_MESSAGE = "Last name cannot be empty";
  private static final String EMPTY_EMAIL_MESSAGE = "Email cannot be empty";
  private static final String EMPTY_PASSWORD_MESSAGE = "Password cannot be empty";
  private static final String PASSWORD_TOO_SHORT_MESSAGE =
      "The password have to be at least 4 characters long";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;
  @MockitoBean
  private UserService userService;
  @MockitoBean
  private RoleService roleService;
  @MockitoBean
  private UserMapper userMapper;
  @MockitoBean
  private ProfileMapper profileMapper;
  @MockitoBean
  private ApplicationEventPublisher eventPublisher;
  @MockitoBean
  private VerificationTokenService verificationTokenService;
  @MockitoBean
  private JwtDecoder jwtDecoder;

  @BeforeEach
  void securitySetup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();

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
  void shouldRegisterUser() throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", "test");
    User user = new User("test@test.com", "test");
    Role role = new Role("TEST");
    Profile profile = new Profile(user.getEmail(), "Test", null, "User");
    when(userMapper.mapToUser(any(UserDto.class))).thenReturn(user);
    when(profileMapper.mapToProfile(any(UserDto.class))).thenReturn(profile);
    when(roleService.getRoleByName(anyString())).thenReturn(role);
    doNothing().when(eventPublisher).publishEvent(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andExpect(MockMvcResultMatchers.status().isCreated());
  }

  @Test
  void shouldPublishRegistrationEvent() throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", "test");
    User user = new User("test@test.com", "test");
    Role role = new Role("TEST");
    Profile profile = new Profile(user.getEmail(), "Test", null, "User");
    when(userMapper.mapToUser(any(UserDto.class))).thenReturn(user);
    when(roleService.getRoleByName("DESIGNER")).thenReturn(role);
    when(profileMapper.mapToProfile(any(UserDto.class))).thenReturn(profile);
    doNothing().when(eventPublisher).publishEvent(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andExpect(MockMvcResultMatchers.status().isCreated());
    verify(eventPublisher, times(1))
        .publishEvent(argThat(event ->
            ((OnRegistrationComplete) event).getUser().getRoles().size() == 1
                && ((OnRegistrationComplete) event).getUser().getRoles().contains(role))
        );
    verify(eventPublisher, times(1)).publishEvent(
        argThat(event -> ((OnRegistrationComplete) event).getProfile().getEmail().equals(profile.getEmail()))
    );
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldReturnValidationError_WhenEmailEmptyOrNull(String email) throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", email, "test");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(EMPTY_EMAIL_MESSAGE)));
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldReturnValidationError_WhenFirstNameEmptyOrNull(String firstName) throws Exception {
    // Given
    UserDto userDto = new UserDto(firstName, null, "User", "test@test.com", "test");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(EMPTY_FIRST_NAME_MESSAGE)));
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldReturnValidationError_WhenLastNameEmptyOrNull(String lastName) throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, lastName, "test@test.com", "test");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message",
            Matchers.is(EMPTY_LAST_NAME_MESSAGE)));
  }

  @ParameterizedTest
  @NullSource
  void shouldReturnValidationError_WhenPasswordNull(String password) throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(EMPTY_PASSWORD_MESSAGE)));
  }

  @ParameterizedTest
  @ValueSource(strings = {"1"})
  void shouldReturnValidationError_WhenPasswordTooShort(String password) throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(PASSWORD_TOO_SHORT_MESSAGE)));
  }

  @Test
  void shouldReturnDuplicationError_WhenUserAlreadyExists() throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", "test");
    User user = new User("test@test.com", "test");
    when(userMapper.mapToUser(any(UserDto.class))).thenReturn(user);
    doThrow(new DuplicateEmailException("Test message", new Exception())).when(userService).createUser(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }

  @Test
  void shouldReturnValidationError_WhenDBValidationError() throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", "test");
    User user = new User("test@test.com", "test");
    when(userMapper.mapToUser(any(UserDto.class))).thenReturn(user);
    doThrow(new DataValidationException("Test message", new Exception())).when(userService).createUser(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }

  @Test
  void shouldThrowMalformedJson() throws Exception {
    // Given
    String malformedJson = "{ test, }";

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(malformedJson))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message",
            Matchers.containsString("JSON parse error")));
  }

  @Test
  void shouldReturn401_When_NoTokenProvided() throws Exception {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", "test");
    User user = new User("test@test.com", "test");
    Role role = new Role("TEST");
    Profile profile = new Profile(user.getEmail(), "Test", null, "User");

    when(userMapper.mapToUser(any(UserDto.class))).thenReturn(user);
    when(profileMapper.mapToProfile(any(UserDto.class))).thenReturn(profile);
    when(roleService.getRoleByName(anyString())).thenReturn(role);
    doNothing().when(eventPublisher).publishEvent(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Gson().toJson(userDto)))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldConfirmRegistration() throws Exception {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    VerificationToken token = new VerificationToken(1L, "token", user,
        LocalDateTime.now().minusMinutes(24 * 60).plusMinutes(1), false);

    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(CONFIRM_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .param("token", token.getToken()))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(userService, times(1)).updateUser(any(User.class));
    verify(verificationTokenService, times(1)).setUsed(any(VerificationToken.class));
  }

  @Test
  void shouldThrowElementNotFound_When_TokenNotFound() throws Exception {
    // Given
    when(verificationTokenService.getToken(anyString()))
        .thenThrow(new ElementNotFoundException("Test error"));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(CONFIRM_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .param("token", "token"))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldThrowElementNotFound_When_UserNotFound() throws Exception {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    VerificationToken token = new VerificationToken(1L, "token", user, LocalDateTime.now(), false);

    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doNothing().when(verificationTokenService).validateToken(any(VerificationToken.class));
    doThrow(new ElementNotFoundException("Test error"))
        .when(userService).updateUser(any(User.class));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(CONFIRM_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .param("token", "token"))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldThrowExpiredVerification_When_ExpirationBeforeNow() throws Exception {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    VerificationToken token = new VerificationToken(1L, "token", user,
        LocalDateTime.now().minusMinutes(24 * 60).minusMinutes(1), false);

    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doThrow(new ExpiredVerificationToken("Test error"))
        .when(verificationTokenService).validateToken(any(VerificationToken.class));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(CONFIRM_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .param("token", "token"))
        .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity())
        .andExpect(MockMvcResultMatchers.jsonPath(
            "$.message", Matchers.containsString("Test error"))
        );
    verify(eventPublisher, times(1)).publishEvent(any(OnRegisterVerificationFail.class));
  }

  @Test
  void shouldThrowDataValidation_When_InvalidData() throws Exception {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    VerificationToken token = new VerificationToken(1L, "token", user,
        LocalDateTime.now(), false);

    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doNothing().when(verificationTokenService).validateToken(any(VerificationToken.class));
    doThrow(new DataValidationException("Test error", new Exception()))
        .when(userService).updateUser(any(User.class));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(CONFIRM_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .contentType(MediaType.APPLICATION_JSON)
            .param("token", "token"))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldReturn401_When_NoTokenProvided_When_ConfirmRegistration() throws Exception {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", false, Set.of(role));
    VerificationToken token = new VerificationToken(1L, "token", user,
        LocalDateTime.now().minusMinutes(24 * 60).plusMinutes(1), false);

    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(CONFIRM_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .param("token", token.getToken()))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }
}