package org.maxq.profileservice.service.image.upload;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.InMemoryFile;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class S3ImageUploadServiceTest {

  @Value("${aws.s3.profile-images.bucket}")
  private String profileImageUploadBucket;

  @Autowired
  private ImageUploadService service;

  @MockitoBean
  private S3Client s3Client;

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

    // When
    service.uploadImage(file);

    // Then
    verify(s3Client, times(1))
        .putObject(
            eq(request),
            ArgumentMatchers.<RequestBody>argThat(
                argument -> argument.optionalContentLength().equals(requestBody.optionalContentLength())
            )
        );
  }
}