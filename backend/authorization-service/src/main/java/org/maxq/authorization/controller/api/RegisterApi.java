package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Register API")
public interface RegisterApi {

  @Operation(
      summary = "Register new user",
      description = "Register new user in the authorization service. "
          + "Provide user as request body. "
          + "User in a body will be validated"
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "User registered successfully"),
      @ApiResponse(responseCode = "400", description = "Error during registration process", content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  })
  ResponseEntity<Void> register(
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "New user to register in application", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDto.class),
              examples = @ExampleObject(value = "{ \"email\": \"example@example.com\", " +
                  "\"password\": \"Example1234\" }")
          )
      )
      @RequestBody @Valid UserDto userDto) throws DataValidationException, DuplicateEmailException;
}
