package org.maxq.taskservice.service.message.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.service.message.handler.UpdateUserMessageHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UpdateUserMessageListener implements MessageReceiver<UserDto> {

  private final UpdateUserMessageHandler messageHandler;

  @RabbitListener(
      id = "updateUserReceiver",
      queues = "${task.user.queue.update}",
      autoStartup = "${app.listeners.auto-startup}"
  )
  public void receiveUpdateMessage(UserDto user) {
    log.info("Received update user message: {}", user);
    this.receiveMessage(user);
  }


  @Override
  public void receiveMessage(UserDto user) {
    messageHandler.handleMessage(user);
  }
}
