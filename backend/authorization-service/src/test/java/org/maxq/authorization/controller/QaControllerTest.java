package org.maxq.authorization.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebAppConfiguration
@SpringBootTest
@ActiveProfiles("DEV")
class QaControllerTest {

  private static final String URL = "/qa";

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockBean
  private UserService userService;
  @MockBean
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
    VerificationToken token = new VerificationToken(1L, "test", user, LocalDateTime.now());
    when(userService.getUserByEmail("test@test.com")).thenReturn(user);
    when(verificationTokenService.getTokenByUser(any(User.class))).thenReturn(token);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/token")
            .queryParam("email", user.getEmail()))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.is(token.getToken())));
  }
}
