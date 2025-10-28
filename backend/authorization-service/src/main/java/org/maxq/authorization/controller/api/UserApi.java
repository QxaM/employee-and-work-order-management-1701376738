package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.PageDto;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.RoleAlreadyExistsException;
import org.maxq.authorization.domain.exception.RoleDoesNotExistException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Users API")
public interface UserApi {

  @Operation(
      summary = "Returns all users data",
      description = "Returns data of all users only ADMIN users can access this resource."
  )
  @ApiResponse(responseCode = "200", description = "User properly returned from application",
      content = {@Content(
          mediaType = "application/json",
          array = @ArraySchema(schema = @Schema(implementation = GetUserDto.class)))})
  @ApiResponse(responseCode = "403",
      description = "Unauthorized - only ADMIN can access this resource",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  ResponseEntity<PageDto<GetUserDto>> getUsers(
      @RequestParam(required = false, defaultValue = "0")
      @Parameter(
          description = "Page number of the user request",
          schema = @Schema(type = "integer", defaultValue = "0")
      )
      Integer page,
      @Parameter(
          description = "Number of element to return on the page",
          schema = @Schema(type = "integer", defaultValue = "10")
      )
      @RequestParam(required = false, defaultValue = "10") Integer size
  );

  @Operation(
      summary = "Adds role to a user",
      description = "Adds role to a user with given id. Only ADMIN users can access this resource."
  )
  @ApiResponse(responseCode = "200", description = "Role added to the user correctly")
  @ApiResponse(responseCode = "400",
      description = "Role with given ID already exists for the user",
      content = {@Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))}
  )
  @ApiResponse(responseCode = "403",
      description = "Unauthorized - only ADMIN can access this resource",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      }
  )
  @ApiResponse(responseCode = "404",
      description = "User or role with given ID was not found",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      }
  )
  ResponseEntity<Void> addRole(
      @PathVariable
      @Parameter(name = "userId", description = "User ID", required = true)
      Long userId,
      @RequestParam(name = "role")
      @Parameter(name = "role", description = "Role ID", required = true)
      Long roleId) throws ElementNotFoundException, RoleAlreadyExistsException;

  @Operation(
      summary = "Remove role to a user",
      description = "Removes role to a user with given id." +
          "Only ADMIN users can access this resource."
  )
  @ApiResponse(responseCode = "200", description = "Role removed from the user correctly")
  @ApiResponse(responseCode = "400",
      description = "Role with given ID does not exist for the user",
      content = {@Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))}
  )
  @ApiResponse(responseCode = "403",
      description = "Unauthorized - only ADMIN can access this resource",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      }
  )
  @ApiResponse(responseCode = "404",
      description = "User or role with given ID was not found",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      }
  )
  ResponseEntity<Void> removeRole(
      @PathVariable
      @Parameter(name = "userId", description = "User ID", required = true)
      Long userId,
      @RequestParam(name = "role")
      @Parameter(name = "role", description = "Role ID", required = true)
      Long roleId) throws ElementNotFoundException, RoleAlreadyExistsException, RoleDoesNotExistException;
}
