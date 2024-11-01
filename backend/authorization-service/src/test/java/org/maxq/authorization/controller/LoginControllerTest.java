package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@WebAppConfiguration
@SpringBootTest
class LoginControllerTest {

  private static final String URL = "/login";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

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