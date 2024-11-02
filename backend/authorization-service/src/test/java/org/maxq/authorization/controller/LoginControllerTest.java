package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@WebAppConfiguration
@SpringBootTest
class LoginControllerTest {

  private static final String URL = "/login";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockBean
  private TokenService tokenService;

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
}