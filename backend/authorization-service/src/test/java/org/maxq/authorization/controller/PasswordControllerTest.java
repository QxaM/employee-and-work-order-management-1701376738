package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.config.MockitoPublisherConfiguration;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.event.OnPasswordReset;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.util.Base64;
import java.util.Collections;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@WebAppConfiguration
@Import(MockitoPublisherConfiguration.class)
class PasswordControllerTest {

  private static final String URL = "/password";
  private static final String RESET_URL = "/reset";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockitoBean
  private ApplicationEventPublisher eventPublisher;
  @MockitoBean
  private VerificationTokenService verificationTokenService;
  @MockitoBean
  private UserService userService;
  @MockitoBean
  private PasswordEncoder passwordEncoder;
  @MockitoBean
  private JwtDecoder jwtDecoder;

  private String password;
  private String encodedPassword;
  private VerificationToken token;

  @BeforeEach
  void setup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();

    password = "newPassword";
    encodedPassword = Base64.getEncoder().encodeToString(password.getBytes());
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, "test@test.com", "test", true, Set.of(role));
    token = new VerificationToken(1L, "test", user, LocalDateTime.now(), false);

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
  void shouldPublishPasswordResetEvent() throws Exception {
    // Given
    doNothing().when(eventPublisher).publishEvent(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL + RESET_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .param("email", "test@test.com"))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(eventPublisher, times(1))
        .publishEvent(any(OnPasswordReset.class));
  }

  @Test
  void shouldReturn401_When_NoTokenProvided_ResetPassword() throws Exception {
    // Given
    doNothing().when(eventPublisher).publishEvent(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL + RESET_URL)
            .param("email", "test@test.com"))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldUpdatePassword() throws Exception {
    // Given
    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doNothing().when(verificationTokenService).validateToken(any(VerificationToken.class));
    when(passwordEncoder.encode(password)).thenReturn(password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + RESET_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .param("token", token.getToken())
            .param("password", encodedPassword))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(userService, times(1)).updateUser(any(User.class));
    verify(userService).updateUser(argThat(updatedUser -> password.equals(updatedUser.getPassword())));
    verify(verificationTokenService, times(1)).setUsed(any(VerificationToken.class));
  }

  @Test
  void shouldThrowException_When_TokenNotFound() throws Exception {
    // Given
    when(verificationTokenService.getToken(token.getToken()))
        .thenThrow(new ElementNotFoundException("Test error"));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + RESET_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .param("token", token.getToken())
            .param("password", encodedPassword))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldThrowException_When_TokenExpired() throws Exception {
    // Given
    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doThrow(new ExpiredVerificationToken("Test error"))
        .when(verificationTokenService).validateToken(any(VerificationToken.class));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + RESET_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .param("token", token.getToken())
            .param("password", encodedPassword))
        .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldThrowException_When_PasswordNotValid() throws Exception {
    // Given
    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doNothing().when(verificationTokenService).validateToken(any(VerificationToken.class));
    doThrow(new DataValidationException("Test error", new Exception()))
        .when(userService).updateUser(any(User.class));
    when(passwordEncoder.encode(password)).thenReturn(password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + RESET_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .param("token", token.getToken())
            .param("password", encodedPassword))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldThrowException_When_UserNotFound() throws Exception {
    // Given
    when(verificationTokenService.getToken(token.getToken())).thenReturn(token);
    doNothing().when(verificationTokenService).validateToken(any(VerificationToken.class));
    doThrow(new ElementNotFoundException("Test error"))
        .when(userService).updateUser(any(User.class));
    when(passwordEncoder.encode(password)).thenReturn(password);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + RESET_URL)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .param("token", token.getToken())
            .param("password", encodedPassword))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test error")));
  }

  @Test
  void shouldReturn401_When_TokenNotProvided_ConfirmReset() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + RESET_URL)
            .param("token", token.getToken())
            .param("password", encodedPassword))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
  }
}