package org.maxq.taskservice.service.message.handler;

public interface MessageHandler<T> {
  void handleMessage(T message);
}
