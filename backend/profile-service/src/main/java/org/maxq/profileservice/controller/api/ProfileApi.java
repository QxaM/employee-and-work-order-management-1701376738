package org.maxq.profileservice.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.profileservice.domain.HttpErrorMessage;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@Tag(name = "Profiles API")
public interface ProfileApi {

  @Operation(
      summary = "Return my profile user information",
      description = "Returns user information of currently logged in user"
  )
  @ApiResponse(responseCode = "200", description = "User information properly returned",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = ProfileDto.class)
          )
      })
  @ApiResponse(responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  @ApiResponse(responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  @ApiResponse(responseCode = "404",
      description = "Not found - profile for this user does not exists",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  ResponseEntity<ProfileDto> getMyProfile(Authentication authentication)
      throws ElementNotFoundException;

  @Operation(
      summary = "Update profile information",
      description = "Allows to update profile data"
  )
  @ApiResponse(responseCode = "200", description = "User information properly returned")
  @ApiResponse(responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  @ApiResponse(responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource, or tried to " +
          "access profile of other user",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  @ApiResponse(responseCode = "404",
      description = "Not found - profile does not exist",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  ResponseEntity<Void> updateProfile(Authentication authentication, ProfileDto profileDto)
      throws ElementNotFoundException;
}
