package org.maxq.profileservice.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BucketOperationResponse {
  private boolean successful;
  private int statusCode;
  private byte[] data;
}
