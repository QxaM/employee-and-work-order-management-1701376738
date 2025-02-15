package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Register API")
public interface RegisterApi {

  @Operation(
      summary = "Register new user",
      description = "Register new user in the authorization service. "
          + "Provide user as request body. User in a body will be validated. "
          + "Service will asynchronously send confirmation email to the user."
  )
  @ApiResponse(responseCode = "201", description = "User registered successfully")
  @ApiResponse(responseCode = "400", description = "Error during registration process", content = {
      @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
  })
  ResponseEntity<Void> register(
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "New user to register in application", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDto.class),
              examples = @ExampleObject("{ \"email\": \"example@example.com\", " +
                  "\"password\": \"Example1234\" }")
          )
      )
      @RequestBody @Valid UserDto userDto) throws DataValidationException, DuplicateEmailException;

  @Operation(
      summary = "Confirms registration of a user",
      description = "When correct one-time verification token is provided this method will verify"
          + " and unlock the newly registered user. If the provided was expired a new email "
          + "will be sent."
  )
  @ApiResponse(responseCode = "200", description = "User verified successfully")
  @ApiResponse(responseCode = "400", description = "Error during verification process", content = {
      @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
  })
  @ApiResponse(responseCode = "404", description = "Provided token was not found or is not " +
      "linked to any registration", content = {
      @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
  })
  @ApiResponse(responseCode = "422", description = "Token expired, new email was sent", content = {
      @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
  })
  ResponseEntity<Void> confirmRegistration(@RequestParam String token) throws ElementNotFoundException, ExpiredVerificationToken, DataValidationException;
}
