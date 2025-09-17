package org.maxq.profileservice.service.message.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.maxq.profileservice.service.image.processor.ApacheImageProcessor;
import org.maxq.profileservice.service.image.processor.ApacheImageRandomizer;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileImageUploadHandler implements MessageHandler<ImageDto> {

  private final InMemoryFileMapper inMemoryFileMapper;
  private final ApacheImageService imageService;
  private final ApacheImageProcessor imageProcessor;
  private final ApacheImageRandomizer imageRandomizer;

  @Override
  public void handleMessage(ImageDto message) {
    log.info("Handling message with image: {}", message);
    InMemoryFile file = inMemoryFileMapper.mapToInMemoryFile(message);

    try {
      InMemoryFile fileWithoutMetadata = imageProcessor.stripMetadata(file);
      log.info("Stripped metadata from file: {}", fileWithoutMetadata.getName());

      BufferedImage resizedImage = imageProcessor.resizeImage(file);
      log.info("Resized image: {}x{}", resizedImage.getWidth(), resizedImage.getHeight());

      BufferedImage cleanImage = imageProcessor.cleanImage(resizedImage);
      log.info("Rewritten file into clean raster");

      BufferedImage randomizedImage = imageRandomizer.randomize(cleanImage);
      log.info("Randomized image - added noise");

      InMemoryFile jpegImage = imageService.writeToJpeg(randomizedImage);
      log.info("Cleaned image written to file: {}", jpegImage.getName());
      log.info("Cleaned image size: {}", imageService.getMetadata(jpegImage.getData()));
    } catch (IOException | IllegalArgumentException e) {
      log.error("Failed processing image: {}", file, e);
    }
  }
}
