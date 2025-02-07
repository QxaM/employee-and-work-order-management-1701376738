package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.dto.TokenDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@Tag(name = "Login API")
public interface LoginApi {

  @Operation(
      summary = "User authentication",
      description = "Authenticate user and provide with JWT token in return",
      security = @SecurityRequirement(name = "basicAuth")
  )
  @ApiResponse(responseCode = "200", description = "Successful authentication", content = {
      @Content(mediaType = "application/json", schema = @Schema(implementation = TokenDto.class))
  })
  @ApiResponse(responseCode = "401", description = "Invalid credentials or account disabled",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  ResponseEntity<TokenDto> login(Authentication authentication);
}
