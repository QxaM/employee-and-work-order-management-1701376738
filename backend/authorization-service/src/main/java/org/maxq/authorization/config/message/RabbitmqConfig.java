package org.maxq.authorization.config.message;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitmqConfig {

  @Value("${profile.exchange}")
  private String profileTopicExchangeName;

  @Value("${task.exchange}")
  private String taskTopicExchangeName;

  @Bean
  public TopicExchange profileTopicExchange() {
    return new TopicExchange(profileTopicExchangeName);
  }

  @Bean
  public TopicExchange taskTopicExchange() {
    return new TopicExchange(taskTopicExchangeName);
  }

  @Bean
  public MessageConverter messageConverter() {
    return new Jackson2JsonMessageConverter();
  }
}
