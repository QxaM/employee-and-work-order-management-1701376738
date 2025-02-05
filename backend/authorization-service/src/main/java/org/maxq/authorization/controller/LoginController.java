package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.LoginApi;
import org.maxq.authorization.domain.dto.TokenDto;
import org.maxq.authorization.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController implements LoginApi {

  private final TokenService tokenService;

  @Override
  @PostMapping
  public ResponseEntity<TokenDto> login(Authentication authentication) {
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    String token = tokenService.generateToken(userDetails);
    return ResponseEntity.ok(new TokenDto(token));
  }
}
