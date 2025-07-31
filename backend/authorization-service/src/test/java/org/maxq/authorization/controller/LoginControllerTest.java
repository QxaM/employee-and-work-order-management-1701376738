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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebAppConfiguration
@SpringBootTest
class LoginControllerTest {

  private static final String URL = "/login";

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
  private UserDetailsDbService userDetailsDbService;

  @BeforeEach
  void securitySetup() {

    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();

  }

  @Test
  @WithMockUser(username = "test@test.com")
  void shouldLoginWithUser() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL))
        .andExpect(MockMvcResultMatchers.status().isOk());
  }

  @Test
  @WithMockUser(username = "test@test.com")
  void shouldReturnToken() throws Exception {
    // Given
    when(tokenService.generateToken(any())).thenReturn("test-token");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.token", Matchers.is("test-token")))
        .andExpect(MockMvcResultMatchers.jsonPath("$.expiresIn", Matchers.is(3600)))
        .andExpect(MockMvcResultMatchers.jsonPath("$.type", Matchers.is("Bearer")));
  }

  @Test
  void shouldReturn401_WhenDisabled() throws Exception {
    // Given
    User user = new User("test@test.com", "test");
    when(userDetailsDbService.loadUserByUsername(user.getEmail())).thenReturn(
        org.springframework.security.core.userdetails.User
            .withUsername("test@test.com")
            .password("test")
            .disabled(true)
            .build()
    );

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
  }

  @Test
  void shouldReturn401_WhenUnauthorized() throws Exception {
    // Given
    String message = "Unauthorized to access this resource, login please";

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
  }

  @Test
  @WithMockUser(username = "test@test.com")
  void shouldReturnMethodNotAllowed_WhenGetRequest() throws Exception {
    // Given
    String message = "Request method GET not supported";

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL))
        .andExpect(MockMvcResultMatchers.status().isMethodNotAllowed())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(message)));
  }

  @Test
  @WithMockUser(username = "test@test.com")
  void shouldReturnMeData_WhenAuthorized() throws Exception {
    // Given
    String userEmail = "test@test.com";

    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user = new User(userEmail, "test", Set.of(role));

    RoleDto roleDto = new RoleDto(role.getId(), role.getName());
    MeDto me = new MeDto(userEmail, List.of(roleDto));

    when(userService.getUserByEmail(userEmail)).thenReturn(user);
    when(userMapper.mapToMeDto(any(User.class))).thenReturn(me);

    Jwt jwt = Jwt.withTokenValue("test-token")
        .header("alg", "none")
        .subject(userEmail)
        .claim("roles", List.of(role.getName()))
        .build();
    JwtAuthenticationToken token = new JwtAuthenticationToken(jwt,
        Stream.of(role).map(roleValue -> new SimpleGrantedAuthority(roleValue.getName())).toList());
    SecurityContextHolder.getContext().setAuthentication(token);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders.get(URL + "/me"))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.email", Matchers.is(me.getEmail())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.roles", Matchers.hasSize(1)))
        .andExpect(MockMvcResultMatchers.jsonPath("$.roles[0].id", Matchers.is(roleDto.getId().intValue())))
        .andExpect(MockMvcResultMatchers.jsonPath("$.roles[0].name", Matchers.is(roleDto.getName())));
  }
}