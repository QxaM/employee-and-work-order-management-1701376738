package org.maxq.taskservice.service.message.listener;

public interface MessageReceiver<T> {
  void receiveMessage(T payload);
}
