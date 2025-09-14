package org.maxq.profileservice.service.message.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileImageUploadHandler implements MessageHandler<ImageDto> {

  private final InMemoryFileMapper inMemoryFileMapper;
  private final ApacheImageService imageService;

  @Override
  public void handleMessage(ImageDto message) {
    log.info("Handling message with image: {}", message);
    InMemoryFile file = inMemoryFileMapper.mapToInMemoryFile(message);

    try {
      InMemoryFile fileWithoutMetadata = imageService.stripMetadata(file);
      log.info("Stripped metadata from file: {}", fileWithoutMetadata.getName());

      BufferedImage resizedImage = imageService.resizeImage(file);
      log.info("Resized image: {}x{}", resizedImage.getWidth(), resizedImage.getHeight());
    } catch (IOException e) {
      log.error("Failed processing image: {}", file, e);
    }
  }
}
