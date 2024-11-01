package org.maxq.authorization.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {

  @PostMapping
  public ResponseEntity<String> login() {
    return ResponseEntity.ok().body("success");
  }
}
