package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Password API")
public interface PasswordApi {

  @Operation(
      summary = "Sends password reset email",
      description = "Sends password reset request email to the user with a given email. " +
          "Method only registers an event - all the processing is made behind the scenes."
  )
  @ApiResponse(responseCode = "200", description = "Password reset should be sent successfully")
  ResponseEntity<Void> resetPassword(@RequestParam String email);
}
