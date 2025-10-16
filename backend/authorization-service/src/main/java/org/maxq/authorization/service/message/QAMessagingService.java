package org.maxq.authorization.service.message;

import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.event.message.RabbitmqMessage;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j(topic = "Messaging Service Stub")
@Service
@Profile("QA")
public class QAMessagingService implements MessageService<RabbitmqMessage<?>> {

  @Override
  public void sendMessage(RabbitmqMessage<?> message) {
    log.info("Sending message: {} to topic: {}", message.getPayload(), message.getTopic());
  }
}
