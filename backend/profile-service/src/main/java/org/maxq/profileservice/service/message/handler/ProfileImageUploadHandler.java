package org.maxq.profileservice.service.message.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.ProfileImage;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.ImageProcessingException;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.image.ApacheImageService;
import org.maxq.profileservice.service.image.processor.ApacheImageProcessor;
import org.maxq.profileservice.service.image.processor.ApacheImageRandomizer;
import org.maxq.profileservice.service.image.upload.ImageUploadService;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileImageUploadHandler implements MessageHandler<ImageDto> {

  private final InMemoryFileMapper inMemoryFileMapper;
  private final ApacheImageService imageService;
  private final ApacheImageProcessor imageProcessor;
  private final ApacheImageRandomizer imageRandomizer;
  private final ImageUploadService imageUploadService;
  private final ProfileService profileService;

  @Override
  public void handleMessage(ImageDto message) {
    log.info("Handling message with image: {}", message);
    InMemoryFile file = inMemoryFileMapper.mapToInMemoryFile(message);

    try {
      InMemoryFile jpegImage = processImage(file);
      uploadImageToStorage(jpegImage);
      updateAndCleanupProfileImage(message.getUserEmail(), jpegImage);
    } catch (ImageProcessingException | ElementNotFoundException | BucketOperationException e) {
      log.error("Failed processing image: {}", file, e);
    }
  }

  public InMemoryFile processImage(InMemoryFile image) throws ImageProcessingException {
    log.info("Basic image processing - resized and rewritten into clean raster");
    BufferedImage cleanImage = imageProcessor.process(image);

    log.info("Randomizing image - adding noise, shifts and compression");
    BufferedImage randomizedImage = imageRandomizer.randomize(cleanImage);

    InMemoryFile jpegImage = imageService.writeToJpeg(randomizedImage);
    log.info("Cleaned image written to file: {}", jpegImage.getName());
    return jpegImage;
  }

  public void uploadImageToStorage(InMemoryFile image) throws BucketOperationException {
    log.info("Uploading image to storage bucket");
    BucketOperationResponse response = imageUploadService.uploadImage(image);

    if (!response.isSuccessful()) {
      throw new BucketOperationException(
          "S3 upload failed with status: " + response.getStatusCode()
      );
    }

    log.info("Image uploaded to S3 successful: {}", response);
  }

  public void updateAndCleanupProfileImage(String userEmail, InMemoryFile image) throws ElementNotFoundException {
    Profile oldProfile = profileService.getProfileByEmail(userEmail);
    ProfileImage oldProfileImage = oldProfile.getProfileImage();

    ProfileImage newProfileImage = new ProfileImage(
        image.getName(), image.getContentType(), image.getData().length
    );
    profileService.updateProfileImage(oldProfile, newProfileImage);
    log.info("Updated profile image for user {} with image {}", userEmail, image.getName());

    if (oldProfileImage != null) {
      cleanupOldImage(oldProfileImage.getName());
    }
  }

  public void cleanupOldImage(String imageName) {
    log.info("Deleting existing image in S3: {}", imageName);
    BucketOperationResponse deleteResponse = imageUploadService.deleteImage(imageName);

    if (deleteResponse.isSuccessful()) {
      log.info("Image deleted from S3: {}", imageName);
    } else {
      log.warn("Failed to delete old profile image {}, status {}",
          imageName,
          deleteResponse.getStatusCode()
      );
    }
  }
}
