package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.MeDto;
import org.maxq.authorization.domain.dto.RoleDto;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.security.UserDetailsDbService;
import org.maxq.authorization.service.TokenService;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.Instant;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebAppConfiguration
@SpringBootTest
class LoginControllerTest {

  private static final String URL = "/login";
  Jwt jwt = Jwt.withTokenValue("test-token")
      .header("alg", "RS256")
      .subject("robot")
      .issuer("api-gateway-service")
      .claim("type", "access_token")
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();
  String userEmail = "test@test.com";
  String password = "test";
  String basicToken = Base64.getEncoder().encodeToString((userEmail + ":" + password).getBytes());
  private MockMvc mockMvc;
  @Autowired
  private WebApplicationContext webApplicationContext;
  @MockitoBean
  private TokenService tokenService;
  @MockitoBean
  private UserService userService;
  @MockitoBean
  private UserMapper userMapper;
  @MockitoBean
  private PasswordEncoder passwordEncoder;
  @MockitoBean
  private JwtDecoder jwtDecoder;
  @MockitoBean
  private UserDetailsDbService userDetailsDbService;

  @BeforeEach
  void securitySetup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();

    when(jwtDecoder.decode("test-token")).thenReturn(jwt);
  }

  @Test
  void shouldLoginWithUser() throws Exception {
    // Given
    User user = new User(userEmail, password, true);
    when(passwordEncoder.encode(password)).thenReturn(password);
    when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
    when(userService.getUserByEmail(userEmail)).thenReturn(user);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-Basic-Authorization", basicToken))
        .andExpect(MockMvcResultMatchers.status().isOk());
  }

  @Test
  void shouldReturnToken() throws Exception {
    // Given
    User user = new User(userEmail, password, true);
    when(passwordEncoder.encode(password)).thenReturn(password);
    when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
    when(userService.getUserByEmail(userEmail)).thenReturn(user);
    when(tokenService.generateToken(any())).thenReturn("test-token");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-Basic-Authorization", basicToken))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.token", Matchers.is("test-token")))
        .andExpect(MockMvcResultMatchers.jsonPath("$.expiresIn", Matchers.is(3600)))
        .andExpect(MockMvcResultMatchers.jsonPath("$.type", Matchers.is("Bearer")));
  }

  @Test
  void shouldReturn401_WhenDisabled() throws Exception {
    // Given
    User user = new User(userEmail, password);
    when(passwordEncoder.encode(password)).thenReturn(password);
    when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
    when(userService.getUserByEmail(userEmail)).thenReturn(user);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-Basic-Authorization", basicToken))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
  }

  @Test
  void shouldReturn401_WhenUnauthorized() throws Exception {
    // Given
    User user = new User(userEmail, password);
    when(passwordEncoder.encode(password)).thenReturn(password);
    when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
    when(userService.getUserByEmail(userEmail)).thenReturn(user);

    String message = "Unauthorized to access this resource, login please";

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
  }

  @Test
  @WithMockUser(username = "test@test.com")
  void shouldReturnMethodNotAllowed_WhenGetRequest() throws Exception {
    // Given
    User user = new User(userEmail, password, true);
    when(passwordEncoder.encode(password)).thenReturn(password);
    when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
    when(userService.getUserByEmail(userEmail)).thenReturn(user);

    String message = "Request method GET not supported";

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-Basic-Authorization", basicToken))
        .andExpect(MockMvcResultMatchers.status().isMethodNotAllowed())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
  }

  @Test
  void shouldReturn401_When_RobotTokenNotPresent() throws Exception {
    // Given
    User user = new User(userEmail, password, true);
    when(passwordEncoder.encode(password)).thenReturn(password);
    when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
    when(userService.getUserByEmail(userEmail)).thenReturn(user);

    String message = "Unauthorized to access this resource, login please";

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL)
            .header("X-Basic-Authorization", basicToken))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
  }

  @Test
  void shouldReturnMeData_WhenAuthorized() throws Exception {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user = new User(userEmail, "test", Set.of(role));

    RoleDto roleDto = new RoleDto(role.getId(), role.getName());
    MeDto me = new MeDto(userEmail, List.of(roleDto));

    when(userService.getUserByEmail(userEmail)).thenReturn(user);
    when(userMapper.mapToMeDto(any(User.class))).thenReturn(me);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders.get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", userEmail)
            .header("X-User-Roles", "ROLE_" + role.getName()))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.email", Matchers.is(me.getEmail())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.roles", Matchers.hasSize(1)))
        .andExpect(MockMvcResultMatchers.jsonPath("$.roles[0].id", Matchers.is(roleDto.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.roles[0].name", Matchers.is(roleDto.getName())));
  }

  @Test
  void shouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user = new User(userEmail, "test", Set.of(role));

    RoleDto roleDto = new RoleDto(role.getId(), role.getName());
    MeDto me = new MeDto(userEmail, List.of(roleDto));

    when(userService.getUserByEmail(userEmail)).thenReturn(user);
    when(userMapper.mapToMeDto(any(User.class))).thenReturn(me);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders.get(URL + "/me")
            .header("X-User", userEmail)
            .header("X-User-Roles", "ROLE_" + role.getName()))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldReturn401_When_NoUserHeaders() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders.get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isForbidden());
  }
}