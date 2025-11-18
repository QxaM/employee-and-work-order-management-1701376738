package org.maxq.taskservice.service.message.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.taskservice.domain.dto.UserDto;
import org.maxq.taskservice.service.message.handler.CreateUserMessageHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CreateUserMessageReceiver implements MessageReceiver<UserDto> {

  private final CreateUserMessageHandler messageHandler;

  @RabbitListener(
      id = "createUserReceiver",
      queues = "${task.user.queue.create}",
      autoStartup = "${app.listeners.auto-startup}"
  )
  public void receiveCreateMessage(UserDto user) {
    receiveMessage(user);
  }

  @Override
  public void receiveMessage(UserDto user) {
    log.info("Received message: {}", user);
    messageHandler.handleMessage(user);
  }
}
