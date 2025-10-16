package org.maxq.profileservice.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@RequiredArgsConstructor
@ToString
public class ImageSize {

  private final int width;
  private final int height;
}
