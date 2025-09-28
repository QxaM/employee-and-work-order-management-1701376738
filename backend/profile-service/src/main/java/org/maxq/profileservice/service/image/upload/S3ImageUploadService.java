package org.maxq.profileservice.service.image.upload;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.mapper.BucketOperationResponseMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Service
@Profile("!QA & !SIT")
@RequiredArgsConstructor
public class S3ImageUploadService implements ImageUploadService {

  private final S3Client profileImageUploadClient;
  private final BucketOperationResponseMapper responseMapper;

  @Value("${aws.s3.profile-images.bucket}")
  private String profileImageUploadBucket;

  @Override
  public BucketOperationResponse uploadImage(InMemoryFile file) {
    PutObjectRequest request = PutObjectRequest.builder()
        .bucket(profileImageUploadBucket)
        .contentType(file.getContentType())
        .contentLength((long) file.getData().length)
        .key(file.getName())
        .build();
    RequestBody requestBody = RequestBody.fromBytes(file.getData());
    PutObjectResponse response = profileImageUploadClient.putObject(request, requestBody);
    return responseMapper.mapToBucketOperationResponse(response);
  }

  @Override
  public BucketOperationResponse deleteImage(String imageName) {
    DeleteObjectRequest request = DeleteObjectRequest.builder()
        .bucket(profileImageUploadBucket)
        .key(imageName)
        .build();
    DeleteObjectResponse response = profileImageUploadClient.deleteObject(request);
    return responseMapper.mapToBucketOperationResponse(response);
  }
}
