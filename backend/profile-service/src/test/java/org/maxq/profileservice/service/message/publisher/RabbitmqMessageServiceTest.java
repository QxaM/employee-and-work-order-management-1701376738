package org.maxq.profileservice.service.message.publisher;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.service.message.RabbitmqMessage;
import org.springframework.amqp.core.TopicExchange;
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
  private RabbitmqMessageService messageService;

  @MockitoBean
  private TopicExchange topicExchange;
  @MockitoBean
  private RabbitTemplate rabbitTemplate;

  @Test
  void shouldPostMessage() {
    // Given
    String exchangeName = "exchange";
    String topicName = "exchange.topic";
    ProfileDto profileDto = new ProfileDto(1L, "test@test.com", "Test", null, "User");
    RabbitmqMessage<ProfileDto> message = new RabbitmqMessage<>(profileDto, topicName);

    when(topicExchange.getName()).thenReturn(exchangeName);

    // When
    messageService.sendMessage(message);

    // Then
    verify(rabbitTemplate, times(1)).convertAndSend(exchangeName, topicName, profileDto);
  }
}
