package org.maxq.profileservice.service.image.upload;

import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@Profile("QA | SIT")
public class QaImageUploadService implements ImageUploadService {

  @Value("${aws.s3.profile-images.bucket}")
  private String profileImageUploadBucket;
  @Value("classpath:adminProfile.jpg")
  private Resource correctJpeg;

  @Override
  public BucketOperationResponse getImage(String imageName) {
    log.info("Fetching image {} from bucket {}", imageName, profileImageUploadBucket);
    try {
      return new BucketOperationResponse(
          true, 200, correctJpeg.getContentAsByteArray()
      );
    } catch (IOException e) {
      log.error("Failed to fetch image {}", imageName, e);
      return new BucketOperationResponse(
          false, 500, null
      );
    }
  }

  @Override
  public BucketOperationResponse deleteImage(String imageName) {
    log.info("Deleting image {} from bucket {}", imageName, profileImageUploadBucket);
    return new BucketOperationResponse(
        true, 200, null
    );
  }

  @Override
  public BucketOperationResponse uploadImage(InMemoryFile file) {
    log.info("Uploading image {} to bucket {}", file.getName(), profileImageUploadBucket);
    return new BucketOperationResponse(
        true, 200, null
    );
  }
}
