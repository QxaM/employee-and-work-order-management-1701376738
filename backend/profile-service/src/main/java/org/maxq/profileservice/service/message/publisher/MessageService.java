package org.maxq.profileservice.service.message.publisher;

import org.maxq.profileservice.event.message.Message;

public interface MessageService<M extends Message<?>> {

  void sendMessage(M message);
}

