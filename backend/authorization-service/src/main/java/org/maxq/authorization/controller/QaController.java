package org.maxq.authorization.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.QaApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/qa")
@RequiredArgsConstructor
@Profile({"QA", "DEV"})
public class QaController implements QaApi {

  private final UserService userService;
  private final VerificationTokenService verificationTokenService;

  @Override
  @GetMapping("/token")
  public ResponseEntity<String> fetchNonExpiredVerificationTokenForUser(@RequestParam String email) throws ElementNotFoundException {
    User user = userService.getUserByEmail(email);
    String token = verificationTokenService.getTokenByUser(user).getToken();
    return ResponseEntity.ok(token);
  }

  @Override
  @PatchMapping("/token/{token}")
  public ResponseEntity<Void> updateTokenCreationDate(@PathVariable String token,
                                                      @RequestParam LocalDateTime creationDate) throws ElementNotFoundException {
    verificationTokenService.updateCreationDate(token, creationDate);
    return ResponseEntity.ok().build();
  }
}
