package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.dto.GetUserDto;

import java.util.List;

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
  List<GetUserDto> getUsers();
}
