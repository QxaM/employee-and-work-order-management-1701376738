package org.maxq.profileservice.service.image.upload;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.mapper.BucketOperationResponseMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

@Service
@Profile("!QA & !SIT")
@RequiredArgsConstructor
public class S3ImageUploadService implements ImageUploadService {

  private final S3Client profileImageUploadClient;
  private final BucketOperationResponseMapper responseMapper;

  @Value("${aws.s3.profile-images.bucket}")
  private String profileImageUploadBucket;

  @Override
  public BucketOperationResponse getImage(String imageName) throws BucketOperationException {
    GetObjectRequest request = GetObjectRequest.builder()
        .bucket(profileImageUploadBucket)
        .key(imageName)
        .build();
    ResponseBytes<GetObjectResponse> response = profileImageUploadClient.getObjectAsBytes(request);
    BucketOperationResponse operationResponse = responseMapper.mapToBucketOperationResponse(response);

    if (!operationResponse.isSuccessful()) {
      throw new BucketOperationException("Fetching image " + imageName
          + " failed with status code: " + operationResponse.getStatusCode());
    }

    if (operationResponse.getData() == null) {
      throw new BucketOperationException("No image data for: " + imageName);
    }

    return operationResponse;
  }

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
