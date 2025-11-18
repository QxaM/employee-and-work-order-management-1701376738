package org.maxq.taskservice.controller.api;

import org.maxq.taskservice.domain.dto.UserDto;
import org.springframework.http.ResponseEntity;

public interface QaApi {

  ResponseEntity<UserDto> createUser(UserDto userDto);

  ResponseEntity<UserDto> updateUser(UserDto userDto);
}
