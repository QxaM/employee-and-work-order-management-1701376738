package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
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

  @Operation(
      summary = "Sets new password for a user",
      description = "When correct one-time verification token is provided this method will verify"
          + " and change the password for the user the newly registered user. If token was used "
          + " or expired a generic error will appear."
  )
  @ApiResponse(responseCode = "200", description = "Password reset successful")
  @ApiResponse(responseCode = "400", description = "Error during password reset process",
      content = {@Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))}
  )
  @ApiResponse(responseCode = "422", description = "Token expired", content = {
      @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
  })
  ResponseEntity<Void> updatePassword(@RequestParam String token,
                                      @Parameter(
                                          required = true,
                                          description = "Base64 encoded password"
                                      ) @RequestParam String password)
      throws ElementNotFoundException, ExpiredVerificationToken, DataValidationException;
}