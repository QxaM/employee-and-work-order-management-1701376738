package org.maxq.authorization.service.message;

import org.maxq.authorization.event.message.Message;

public interface MessageService<M extends Message<?>> {

  void sendMessage(M message);
}
