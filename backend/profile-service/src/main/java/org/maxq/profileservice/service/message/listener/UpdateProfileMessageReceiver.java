package org.maxq.profileservice.service.message.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.service.message.handler.UpdateProfileHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UpdateProfileMessageReceiver implements MessageReceiver<ProfileDto> {

  private final UpdateProfileHandler updateProfileHandler;

  @RabbitListener(
      id = "updateProfileReceiver",
      queues = "${profile.queue.update}",
      autoStartup = "${app.listeners.auto-startup}"
  )
  public void receiveCreateMessage(ProfileDto profile) {
    receiveMessage(profile);
  }

  @Override
  public void receiveMessage(ProfileDto profile) {
    log.info("Received message: {}", profile);
    updateProfileHandler.handleMessage(profile);
  }
}
