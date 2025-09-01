package org.maxq.profileservice.event.message;

import lombok.Getter;

@Getter
public class RabbitmqMessage<T> extends Message<T> {

  private final String topic;

  public RabbitmqMessage(T payload, String topic) {
    super(payload);
    this.topic = topic;
  }
}

