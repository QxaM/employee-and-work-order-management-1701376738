package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.PasswordApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.event.OnPasswordReset;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("/password")
@RequiredArgsConstructor
public class PasswordController implements PasswordApi {

  private final UserService userService;
  private final VerificationTokenService verificationTokenService;
  private final ApplicationEventPublisher eventPublisher;
  private final PasswordEncoder passwordEncoder;

  @Override
  @PostMapping("/reset")
  public ResponseEntity<Void> resetPassword(@RequestParam String email) {
    eventPublisher.publishEvent(new OnPasswordReset(email));
    return ResponseEntity.ok().build();
  }

  @Override
  @PatchMapping("/reset")
  public ResponseEntity<Void> updatePassword(@RequestParam String token, @RequestParam String password)
      throws ElementNotFoundException, ExpiredVerificationToken, DataValidationException {
    VerificationToken foundToken = verificationTokenService.getToken(token);

    verificationTokenService.validateToken(foundToken);

    User user = foundToken.getUser();
    user.setPassword(
        passwordEncoder.encode(
            new String(Base64.getDecoder().decode(password.getBytes()))
        )
    );
    userService.updateUser(user);

    return ResponseEntity.ok().build();
  }
}
