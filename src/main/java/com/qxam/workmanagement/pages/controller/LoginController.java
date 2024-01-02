package com.qxam.workmanagement.pages.controller;

import com.qxam.workmanagement.domain.dto.UserDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("login")
public class LoginController {

  @GetMapping
  public String loginPage(Model model) {
    UserDto userDto = new UserDto();
    model.addAttribute("user", userDto);
    return "login";
  }
}
