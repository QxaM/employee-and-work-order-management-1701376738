package org.maxq.taskservice.controller.api;

import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.domain.exception.ElementNotFoundException;
import org.springframework.http.ResponseEntity;

public interface QaApi {

  ResponseEntity<UserDto> getUser(Long userId) throws ElementNotFoundException;

  ResponseEntity<UserDto> createUser(UserDto userDto);

  ResponseEntity<UserDto> updateUser(UserDto userDto);
}
