package org.maxq.taskservice.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.maxq.taskservice.domain.HttpErrorMessage;
import org.maxq.taskservice.domain.dto.TaskDto;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.maxq.taskservice.domain.exception.UserDoesNotExistException;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Tasks API")
public interface TaskApi {

  @Operation(
      summary = "Create new task in database",
      description = "Allow to create a new task with provided data. "
          + "User assigned to the task have to exist, otherwise error will be raised."
  )
  @ApiResponse(
      responseCode = "200",
      description = "Task created successfully",
      content = @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = TaskDto.class)
      )
  )
  @ApiResponse(
      responseCode = "400",
      description = "User associated with the task does not exist",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  ResponseEntity<TaskDto> createTask(
      @RequestBody(
          content = @Content(
              mediaType = "application/json", schema =
          @Schema(implementation = TaskDto.class)
          ),
          description = "Task data to be created",
          required = true
      ) TaskDto task
  ) throws UserDoesNotExistException;

  @Operation(
      summary = "Update existing task in the database",
      description = "Allow to update a task with provided data. "
          + "User assigned to the task have to exist, otherwise error will be raised."
  )
  @ApiResponse(
      responseCode = "200",
      description = "Task updated successfully",
      content = @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = TaskDto.class)
      )
  )
  @ApiResponse(
      responseCode = "400",
      description = "User associated with the task does not exist",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "404",
      description = "Provided task does not exist - cannot updated non existing task"
          + "Use POST to create a new task.",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  ResponseEntity<TaskDto> updateTask(
      @RequestBody(
          content = @Content(
              mediaType = "application/json", schema =
          @Schema(implementation = TaskDto.class)
          ),
          description = "Task data to be created",
          required = true
      ) TaskDto task
  ) throws UserDoesNotExistException, ElementNotFoundException;

  @Operation(
      summary = "Return all existing tasks from database",
      description = "Returns all existing tasks from database. "
          + "If no tasks exist in database empty List is returned."
  )
  @ApiResponse(
      responseCode = "200",
      description = "Tasks returned successfully",
      content = @Content(
          mediaType = "application/json",
          array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))
      )
  )
  @ApiResponse(
      responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  ResponseEntity<List<TaskDto>> getAllTasks();

  @Operation(
      summary = "Fetch specified task",
      description = "Allows to Fetch a task with provided task ID. "
          + "Provided task have to exist otherwise an error will be raised."
  )
  @ApiResponse(
      responseCode = "200",
      description = "Task retrieved successfully",
      content = @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = TaskDto.class)
      )
  )
  @ApiResponse(
      responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "404",
      description = "Provided task does not exist - cannot fetch non existing task",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  ResponseEntity<TaskDto> getTask(
      @Parameter(
          name = "id",
          description = "ID of a task to fetch",
          example = "123"
      ) Long taskId
  ) throws ElementNotFoundException;

  @Operation(
      summary = "Delete specified task",
      description = "Allows to delete a task with provided task ID. "
          + "Provided task have to exist otherwise an error will be raised."
  )
  @ApiResponse(
      responseCode = "204",
      description = "Task deleted successfully"
  )
  @ApiResponse(
      responseCode = "401",
      description = "Unauthenticated - only request with Robot Token are passed",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "403",
      description = "Unauthorized - only logged in users can access this resource",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  @ApiResponse(
      responseCode = "404",
      description = "Provided task does not exist - cannot delete non existing task",
      content = {
          @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = HttpErrorMessage.class)
          )
      }
  )
  ResponseEntity<Void> deleteTask(
      @Parameter(
          name = "id",
          description = "ID of a task to be deleted",
          example = "123"
      ) Long taskId
  ) throws ElementNotFoundException;
}
