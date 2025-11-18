package org.maxq.profileservice.service.message;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public abstract class Message<T> {
  private final T payload;
}

