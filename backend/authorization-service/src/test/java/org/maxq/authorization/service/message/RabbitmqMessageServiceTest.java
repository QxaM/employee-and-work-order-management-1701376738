package org.maxq.authorization.service.message;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.event.message.RabbitmqMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("DEV")
class RabbitmqMessageServiceTest {

  @Autowired
  private RabbitmqMessageService rabbitmqMessageService;

  @MockitoBean
  private RabbitTemplate rabbitTemplate;

  @Test
  void shouldSendMessage() {
    // Given
    String messagePayload = "test";
    String topic = "profile.create";
    RabbitmqMessage<String> message = new RabbitmqMessage<>(messagePayload, topic);

    // When
    rabbitmqMessageService.sendMessage(message);

    // Then
    verify(rabbitTemplate, times(1))
        .convertAndSend(anyString(), eq(topic), eq(messagePayload));
  }
}
