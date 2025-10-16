package org.maxq.profileservice.mapper;

import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.SdkResponse;
import software.amazon.awssdk.http.SdkHttpResponse;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Service
public class BucketOperationResponseMapper {

  public BucketOperationResponse mapToBucketOperationResponse(SdkResponse sdkResponse) {
    return new BucketOperationResponse(
        sdkResponse.sdkHttpResponse().isSuccessful(),
        sdkResponse.sdkHttpResponse().statusCode(),
        null
    );
  }

  public BucketOperationResponse mapToBucketOperationResponse(ResponseBytes<GetObjectResponse> response) {
    SdkHttpResponse httpResponse = response.response().sdkHttpResponse();
    return new BucketOperationResponse(
        httpResponse.isSuccessful(),
        httpResponse.statusCode(),
        response.asByteArray()
    );
  }
}
