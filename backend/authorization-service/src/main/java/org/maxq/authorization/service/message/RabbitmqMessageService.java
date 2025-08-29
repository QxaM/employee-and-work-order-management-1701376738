package org.maxq.authorization.service.message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.event.message.RabbitmqMessage;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Profile("!QA")
@RequiredArgsConstructor
public class RabbitmqMessageService implements MessageService<RabbitmqMessage<?>> {

  private final TopicExchange topicExchange;
  private final RabbitTemplate rabbitTemplate;

  @Override
  public void sendMessage(RabbitmqMessage<?> message) {
    log.debug(
        "Sending message to exchange {} and topic {}",
        topicExchange.getName(),
        message.getTopic()
    );
    rabbitTemplate.convertAndSend(topicExchange.getName(), message.getTopic(), message.getPayload());
  }
}
