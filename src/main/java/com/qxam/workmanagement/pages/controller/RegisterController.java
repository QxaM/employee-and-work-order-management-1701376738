package com.qxam.workmanagement.pages.controller;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.dto.UserDto;
import com.qxam.workmanagement.domain.events.OnRegistrationComplete;
import com.qxam.workmanagement.domain.exception.DuplicateDocuments;
import com.qxam.workmanagement.mapper.UserMapper;
import com.qxam.workmanagement.service.UserDbService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("register")
@RequiredArgsConstructor
public class RegisterController {

  private final ApplicationEventPublisher eventPublisher;
  private final UserDbService service;
  private final UserMapper mapper;

  @GetMapping
  public String registerPage(Model model) {
    UserDto userDto = new UserDto();
    model.addAttribute("user", userDto);
    return "register";
  }

  @PostMapping("save")
  public String registration(
      @Valid @ModelAttribute("user") UserDto userDto,
      BindingResult bindingResult,
      Model model,
      HttpServletRequest request,
      HttpServletResponse response) {
    User user = mapper.mapToUser(userDto);

    if (bindingResult.hasErrors()) {
      return returnConflictUserDtoAndView(userDto, model, response);
    }

    try {
      User registeredUser = service.createNewUser(user);

      String appUrl = request.getContextPath();
      eventPublisher.publishEvent(new OnRegistrationComplete(this, registeredUser, appUrl));
    } catch (DuplicateDocuments duplicateDocuments) {
      bindingResult.rejectValue("email", StringUtils.EMPTY, "User already exists");
      return returnConflictUserDtoAndView(userDto, model, response);
    }

    return "index";
  }

  private String returnConflictUserDtoAndView(
      UserDto user, Model model, HttpServletResponse response) {
    model.addAttribute("user", user);
    response.setStatus(HttpServletResponse.SC_CONFLICT);
    return "register";
  }
}
