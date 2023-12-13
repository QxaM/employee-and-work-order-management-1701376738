package com.qxam.workmanagement.pages.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MainViewController.class)
class MainViewControllerTests {

  @Autowired private MockMvc mockMvc;

  @Test
  void shouldReturnMainView() throws Exception {
    this.mockMvc
        .perform(get("/").accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(view().name("layouts/default-layout"))
        .andExpect(model().attributeExists("view"))
        .andExpect(model().attribute("view", "index"));
  }
}
