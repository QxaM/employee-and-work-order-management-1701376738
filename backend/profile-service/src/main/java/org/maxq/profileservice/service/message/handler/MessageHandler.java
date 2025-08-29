package org.maxq.profileservice.service.message.handler;

public interface MessageHandler<T> {
  void handleMessage(T message);
}
