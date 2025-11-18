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
public class TaskMessageService implements MessageService<RabbitmqMessage<?>> {

  private final TopicExchange taskTopicExchange;
  private final RabbitTemplate rabbitTemplate;

  @Override
  public void sendMessage(RabbitmqMessage<?> message) {
    log.info(
        "Sending message to exchange {} and topic {}",
        taskTopicExchange.getName(),
        message.getTopic()
    );
    rabbitTemplate.convertAndSend(taskTopicExchange.getName(), message.getTopic(),
        message.getPayload());
  }
}
