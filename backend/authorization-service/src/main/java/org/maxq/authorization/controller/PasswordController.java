package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.PasswordApi;
import org.maxq.authorization.event.OnPasswordReset;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/password")
@RequiredArgsConstructor
public class PasswordController implements PasswordApi {

  private final ApplicationEventPublisher eventPublisher;

  @Override
  @PostMapping("/reset")
  public ResponseEntity<Void> resetPassword(@RequestParam String email) {
    eventPublisher.publishEvent(new OnPasswordReset(email));
    return ResponseEntity.ok().build();
  }
}
