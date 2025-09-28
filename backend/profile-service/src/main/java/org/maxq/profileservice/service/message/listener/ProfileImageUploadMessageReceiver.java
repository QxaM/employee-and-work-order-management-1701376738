package org.maxq.profileservice.service.message.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.service.message.handler.ProfileImageUploadHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileImageUploadMessageReceiver implements MessageReceiver<ImageDto> {

  private final ProfileImageUploadHandler handler;

  @RabbitListener(
      id = "profileImageUploadReceiver",
      queues = "${profile.queue.image.upload}",
      autoStartup = "${app.listeners.auto-startup}"
  )
  public void receiveUploadMessage(ImageDto image) {
    receiveMessage(image);
  }

  @Override
  public void receiveMessage(ImageDto image) {
    log.info("Received message: {}", image);
    handler.handleMessage(image);
  }
}
