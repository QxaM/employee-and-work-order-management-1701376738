package com.qxam.workmanagement.pages.controller;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.dto.UserDto;
import com.qxam.workmanagement.domain.exception.DuplicateDocuments;
import com.qxam.workmanagement.mapper.UserMapper;
import com.qxam.workmanagement.service.UserDbService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@ExtendWith(SpringExtension.class)
@WebAppConfiguration
@SpringBootTest
public class RegisterControllerTests {

  @Autowired private WebApplicationContext context;

  private MockMvc mockMvc;

  @MockBean private UserDbService service;

  @MockBean private UserMapper mapper;

  @BeforeEach
  public void setup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
  }

  @Test
  void shouldReturnRegisterView() throws Exception {
    this.mockMvc
        .perform(get("/register").accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(view().name("layouts/default-layout"))
        .andExpect(model().attributeExists("view"))
        .andExpect(model().attribute("view", "register"))
        .andExpect(model().attributeExists("user"));
  }

  @Test
  void shouldSaveUser() throws Exception {
    // Given
    UserDto userDto = new UserDto(new ObjectId(), "example@example.com", "aTest30@");
    User user = new User(new ObjectId(), "example@example.com", "aTest30@");

    when(mapper.mapToUser(userDto)).thenReturn(user);

    // When + Then
    this.mockMvc
        .perform(
            post("/register/save").flashAttr("user", userDto).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(view().name("layouts/default-layout"))
        .andExpect(model().attributeExists("view"))
        .andExpect(model().attribute("view", "index"));
  }

  @Test
  void shouldThrowUserAlreadyExists() throws Exception {
    // Given
    UserDto userDto = new UserDto(new ObjectId(), "example@example.com", "aTest30@");
    User user = new User(new ObjectId(), "example@example.com", "aTest30@");

    when(mapper.mapToUser(userDto)).thenReturn(user);
    doThrow(DuplicateDocuments.class).when(service).saveUser(user);

    // When + Then
    this.mockMvc
        .perform(
            post("/register/save").flashAttr("user", userDto).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isConflict())
        .andExpect(view().name("layouts/default-layout"))
        .andExpect(model().attributeExists("view"))
        .andExpect(model().attribute("view", "register"))
        .andExpect(model().attributeExists("user"));
  }
}
