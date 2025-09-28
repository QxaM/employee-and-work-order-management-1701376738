package org.maxq.profileservice.service.image.upload;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.mapper.BucketOperationResponseMapper;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("DEV")
class S3ImageUploadServiceTest {

  @Value("${aws.s3.profile-images.bucket}")
  private String profileImageUploadBucket;

  @Autowired
  private S3ImageUploadService service;

  @MockitoBean
  private S3Client s3Client;
  @MockitoBean
  private BucketOperationResponseMapper responseMapper;

  @Test
  void shouldUploadImage() {
    // Given
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/jpeg");
    PutObjectRequest request = PutObjectRequest.builder()
        .bucket(profileImageUploadBucket)
        .contentType(file.getContentType())
        .contentLength((long) file.getData().length)
        .key(file.getName())
        .build();
    RequestBody requestBody = RequestBody.fromBytes(file.getData());
    PutObjectResponse putObjectResponse = PutObjectResponse.builder().build();
    BucketOperationResponse operationResponse = new BucketOperationResponse(
        true,
        -1
    );

    when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class))).thenReturn(putObjectResponse);
    when(responseMapper.mapToBucketOperationResponse(any(PutObjectResponse.class)))
        .thenReturn(operationResponse);

    // When
    BucketOperationResponse actualResponse = service.uploadImage(file);

    // Then
    assertEquals(operationResponse, actualResponse, "Correct response should be returned");
    verify(s3Client, times(1))
        .putObject(
            eq(request),
            ArgumentMatchers.<RequestBody>argThat(
                argument -> argument.optionalContentLength().equals(requestBody.optionalContentLength())
            )
        );
  }

  @Test
  void shouldDeleteImage() {
    // Given
    String fileName = "test.jpeg";
    DeleteObjectRequest request = DeleteObjectRequest.builder()
        .bucket(profileImageUploadBucket)
        .key(fileName)
        .build();
    DeleteObjectResponse deleteObjectResponse = DeleteObjectResponse.builder().build();
    BucketOperationResponse operationResponse = new BucketOperationResponse(
        true,
        -1
    );

    when(s3Client.deleteObject(any(DeleteObjectRequest.class))).thenReturn(deleteObjectResponse);
    when(responseMapper.mapToBucketOperationResponse(any(DeleteObjectResponse.class)))
        .thenReturn(operationResponse);

    // When
    BucketOperationResponse actualResponse = service.deleteImage(fileName);

    // Then
    assertEquals(operationResponse, actualResponse, "Correct response should be returned");
    verify(s3Client, times(1)).deleteObject(request);
  }
}