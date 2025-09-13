package org.maxq.profileservice.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ImageMetadata {

  private final ImageSize size;
  private final ImageSize metaSize;
}
