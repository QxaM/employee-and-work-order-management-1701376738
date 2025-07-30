package org.maxq.authorization.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.dto.RoleDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Roles API")
public interface RoleApi {

  @Operation(
      summary = "Returns all roles data",
      description = "Returns data of all roles created in application." +
          "Only ADMIN users can access this resource."
  )
  @ApiResponse(responseCode = "200", description = "Roles properly returned from application",
      content = {@Content(
          mediaType = "application/json",
          array = @ArraySchema(schema = @Schema(implementation = RoleDto.class)))})
  @ApiResponse(responseCode = "403",
      description = "Unauthorized - only ADMIN can access this resource",
      content = {
          @Content(mediaType = "application/json", schema = @Schema(implementation = HttpErrorMessage.class))
      })
  ResponseEntity<List<RoleDto>> getRoles();
}
