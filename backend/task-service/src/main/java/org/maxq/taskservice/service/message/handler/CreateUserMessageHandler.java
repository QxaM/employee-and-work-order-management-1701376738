package org.maxq.taskservice.service.message.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.domain.exception.DuplicateDataException;
import org.maxq.taskservice.mapper.UserMapper;
import org.maxq.taskservice.service.UserService;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CreateUserMessageHandler implements MessageHandler<UserDto> {

  private final UserService userService;
  private final UserMapper userMapper;

  @Override
  public void handleMessage(UserDto user) {
    log.info("Starting handling of message: {}", user);
    User mappedUser = userMapper.mapToUser(user);
    try {
      userService.createUser(mappedUser);
      log.info("Successfully added user: {}", mappedUser);
    } catch (DuplicateDataException e) {
      log.error("Error processing event: {}", user);
      log.error(e.getMessage());
    }
  }
}
