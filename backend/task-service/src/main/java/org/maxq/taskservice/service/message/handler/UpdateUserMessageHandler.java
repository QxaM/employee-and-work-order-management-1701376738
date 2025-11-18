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
public class UpdateUserMessageHandler implements MessageHandler<UserDto> {

  private final UserService userService;
  private final UserMapper userMapper;

  @Override
  public void handleMessage(UserDto user) {
    log.info("Handling message: {}", user);
    User mappedUser = userMapper.mapToUser(user);
    try {
      userService.updateUser(mappedUser);
      log.info("Successfully updated user: {}", mappedUser);
    } catch (DuplicateDataException e) {
      log.error("Error processing event: {}", user);
      log.error(e.getMessage());
    }
  }
}
