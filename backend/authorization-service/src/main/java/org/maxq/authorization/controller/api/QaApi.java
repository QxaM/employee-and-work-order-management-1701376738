package org.maxq.authorization.controller.api;

import jakarta.websocket.server.PathParam;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

public interface QaApi {

  ResponseEntity<String> fetchNonExpiredVerificationTokenForUser(@RequestParam String email) throws ElementNotFoundException;

  ResponseEntity<Void> updateTokenCreationDate(@PathParam("token") String token,
                                               @RequestParam LocalDateTime creationDate) throws ElementNotFoundException;
}
