package org.maxq.profileservice.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import software.amazon.awssdk.http.SdkHttpResponse;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BucketOperationResponseMapperTest {

  @Autowired
  private BucketOperationResponseMapper mapper;

  @Test
  void shouldMapToBucketOperationResponse_When_SuccessfulPutObjectResponse() {
    // Given
    SdkHttpResponse httpResponse = SdkHttpResponse.builder()
        .statusCode(200)
        .build();
    PutObjectResponse response = (PutObjectResponse) PutObjectResponse.builder()
        .sdkHttpResponse(httpResponse)
        .build();

    // When
    BucketOperationResponse mappedResponse = mapper.mapToBucketOperationResponse(response);

    // Then
    assertTrue(mappedResponse.isSuccessful(), "Mapped response should be successful");
    assertEquals(200, mappedResponse.getStatusCode(), "Mapped response should have correct status code");
  }

  @Test
  void shouldMapToBucketOperationResponse_When_FailedDeleteObjectResponse() {
    // Given
    SdkHttpResponse httpResponse = SdkHttpResponse.builder()
        .statusCode(404)
        .build();
    DeleteObjectResponse response = (DeleteObjectResponse) DeleteObjectResponse.builder()
        .sdkHttpResponse(httpResponse)
        .build();

    // When
    BucketOperationResponse mappedResponse = mapper.mapToBucketOperationResponse(response);

    // Then
    assertFalse(mappedResponse.isSuccessful(), "Mapped response should be failed");
    assertEquals(404, mappedResponse.getStatusCode(),
        "Mapped response should have correct status code");
  }
}