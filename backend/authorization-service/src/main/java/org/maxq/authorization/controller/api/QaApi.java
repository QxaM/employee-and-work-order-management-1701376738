package org.maxq.authorization.controller.api;

import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

public interface QaApi {

  ResponseEntity<String> fetchNonExpiredVerificationTokenForUser(@RequestParam String email) throws ElementNotFoundException;
}
