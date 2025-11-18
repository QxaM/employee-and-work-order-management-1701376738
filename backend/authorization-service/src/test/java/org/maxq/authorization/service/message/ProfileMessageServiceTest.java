package org.maxq.authorization.service.message;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.event.message.RabbitmqMessage;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
@ActiveProfiles("DEV")
class ProfileMessageServiceTest {

  @Autowired
  private ProfileMessageService profileMessageService;

  @Autowired
  private TopicExchange profileTopicExchange;

  @MockitoBean
  private RabbitTemplate rabbitTemplate;

  @Test
  void shouldSendMessage() {
    // Given
    String messagePayload = "test";
    String topic = "profile.create";
    RabbitmqMessage<String> message = new RabbitmqMessage<>(messagePayload, topic);

    // When
    profileMessageService.sendMessage(message);

    // Then
    verify(rabbitTemplate, times(1))
        .convertAndSend(profileTopicExchange.getName(), topic, messagePayload);
  }
}
