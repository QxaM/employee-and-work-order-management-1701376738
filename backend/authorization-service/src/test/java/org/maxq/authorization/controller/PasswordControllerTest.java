package org.maxq.authorization.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.config.MockitoPublisherConfiguration;
import org.maxq.authorization.event.OnPasswordReset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

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

  @MockBean
  private ApplicationEventPublisher eventPublisher;

  @BeforeEach
  void securitySetup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(springSecurity())
        .build();
  }

  @Test
  void shouldPublishPasswordResetEvent() throws Exception {
    // Given
    doNothing().when(eventPublisher).publishEvent(any());

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .post(URL + RESET_URL)
            .param("email", "test@test.com"))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(eventPublisher, times(1))
        .publishEvent(any(OnPasswordReset.class));
  }
}