package org.maxq.profileservice.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@RequiredArgsConstructor
@ToString
public class ImageMetadata {

  private final ImageSize size;
  private final ImageSize metaSize;
}
