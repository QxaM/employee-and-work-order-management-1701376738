package org.maxq.profileservice.mapper;

import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkResponse;

@Service
public class BucketOperationResponseMapper {

  public BucketOperationResponse mapToBucketOperationResponse(SdkResponse sdkResponse) {
    return new BucketOperationResponse(
        sdkResponse.sdkHttpResponse().isSuccessful(),
        sdkResponse.sdkHttpResponse().statusCode()
    );
  }
}
