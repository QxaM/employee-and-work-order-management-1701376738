package org.maxq.profileservice.service.message.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileImageUploadHandler implements MessageHandler<ImageDto> {

  @Override
  public void handleMessage(ImageDto message) {
    log.info("Handling message with image: {}", message);
  }
}
