package org.maxq.profileservice.config.message;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitmqConfig {

  @Value("${profile.exchange}")
  private String topicExchangeName;
  @Value("${profile.queue.create}")
  private String createQueueName;
  @Value("${profile.queue.update}")
  private String updateQueueName;
  @Value("${profile.queue.image.upload}")
  private String imageUploadQueueName;
  @Value("${profile.topic.create}")
  private String createTopicName;
  @Value("${profile.topic.update}")
  private String updateTopicName;
  @Value("${profile.topic.image.upload}")
  private String imageUploadTopicName;

  @Bean
  public TopicExchange topicExchange() {
    return new TopicExchange(topicExchangeName);
  }

  @Bean
  public Queue createQueue() {
    return new Queue(createQueueName, false);
  }

  @Bean
  public Queue updateQueue() {
    return new Queue(updateQueueName, false);
  }

  @Bean
  public Queue imageUploadQueue() {
    return new Queue(imageUploadQueueName, false);
  }

  @Bean
  public Binding createProfileBinding(Queue createQueue, TopicExchange topicExchange) {
    return BindingBuilder.bind(createQueue).to(topicExchange).with(createTopicName);
  }

  @Bean
  public Binding updateProfileBinding(Queue updateQueue, TopicExchange topicExchange) {
    return BindingBuilder.bind(updateQueue).to(topicExchange).with(updateTopicName);
  }

  @Bean
  public Binding profileImageUploadBinding(Queue imageUploadQueue, TopicExchange topicExchange) {
    return BindingBuilder.bind(imageUploadQueue).to(topicExchange).with(imageUploadTopicName);
  }

  @Bean
  public MessageConverter messageConverter() {
    return new Jackson2JsonMessageConverter();
  }
}
