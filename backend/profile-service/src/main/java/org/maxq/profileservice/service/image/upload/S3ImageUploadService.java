package org.maxq.profileservice.service.image.upload;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.domain.InMemoryFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Service
@RequiredArgsConstructor
public class S3ImageUploadService implements ImageUploadService {

  private final S3Client profileImageUploadClient;
  @Value("${aws.s3.profile-images.bucket}")
  private String profileImageUploadBucket;

  @Override
  public PutObjectResponse uploadImage(InMemoryFile file) {
    PutObjectRequest request = PutObjectRequest.builder()
        .bucket(profileImageUploadBucket)
        .contentType(file.getContentType())
        .contentLength((long) file.getData().length)
        .key(file.getName())
        .build();
    RequestBody requestBody = RequestBody.fromBytes(file.getData());
    return profileImageUploadClient.putObject(request, requestBody);
  }
}
