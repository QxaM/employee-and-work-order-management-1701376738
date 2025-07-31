package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@WebAppConfiguration
@SpringBootTest
@ActiveProfiles("DEV")
class QaControllerTest {

  private static final String URL = "/qa";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockitoBean
  private UserService userService;
  @MockitoBean
  private VerificationTokenService verificationTokenService;

  @BeforeEach
  void securitySetup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();
  }

  @Test
  void shouldReturnToken() throws Exception {
    // Given
    User user = new User("test@test.com", "test");
    VerificationToken token = new VerificationToken(1L, "test", user, LocalDateTime.now(), false);
    when(userService.getUserByEmail("test@test.com")).thenReturn(user);
    when(verificationTokenService.getTokenByUser(any(User.class))).thenReturn(token);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/token")
            .queryParam("email", user.getEmail()))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.is(token.getToken())));
  }

  @Test
  void shouldThrow_When_UserNotFound() throws Exception {
    // given
    when(userService.getUserByEmail(anyString()))
        .thenThrow(new ElementNotFoundException("Test message"));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/token")
            .param("email", "test@test.com"))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }

  @Test
  void shouldThrow_When_TokenNotFound() throws Exception {
    // given
    User user = new User("test@test.com", "test");
    when(userService.getUserByEmail(user.getEmail())).thenReturn(user);
    when(verificationTokenService.getTokenByUser(any(User.class)))
        .thenThrow(new ElementNotFoundException("Test message"));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/token")
            .param("email", user.getEmail()))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }

  @Test
  void shouldUpdateTokenCreationDate() throws Exception {
    // Given
    User user = new User("test@test.com", "test");
    VerificationToken token = new VerificationToken(1L, "test", user, LocalDateTime.now(), false);
    LocalDateTime newDate = LocalDateTime.now().minusDays(1);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/token/" + token.getToken())
            .param("creationDate", newDate.toString()))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(verificationTokenService, times(1)).updateCreationDate(token.getToken(), newDate);
  }

  @Test
  void shouldThrowException_When_UpdateException() throws Exception {
    // Given
    doThrow(new ElementNotFoundException("Test message"))
        .when(verificationTokenService).updateCreationDate(anyString(), any(LocalDateTime.class));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .patch(URL + "/token/test")
            .param("creationDate", LocalDateTime.now().toString()))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is("Test message")));
  }
}
