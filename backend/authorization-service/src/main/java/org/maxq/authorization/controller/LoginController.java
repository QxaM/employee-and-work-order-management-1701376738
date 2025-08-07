package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.LoginApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.MeDto;
import org.maxq.authorization.domain.dto.TokenDto;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.TokenService;
import org.maxq.authorization.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController implements LoginApi {

  private final TokenService tokenService;
  private final UserService userService;
  private final UserMapper userMapper;

  @Override
  @PostMapping
  public ResponseEntity<TokenDto> login(Authentication authentication) {
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    String token = tokenService.generateToken(userDetails);
    return ResponseEntity.ok(new TokenDto(token));
  }

  @Override
  @GetMapping("/me")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<MeDto> me(Authentication authentication) throws ElementNotFoundException {
    String username = (String) authentication.getPrincipal();
    User user = userService.getUserByEmail(username);
    return ResponseEntity.ok(userMapper.mapToMeDto(user));
  }
}
