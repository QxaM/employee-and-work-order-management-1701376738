package org.maxq.profileservice.service.message.listener;

public interface MessageReceiver<T> {
  void receiveMessage(T payload);
}
