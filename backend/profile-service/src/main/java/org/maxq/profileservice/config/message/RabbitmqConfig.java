package org.maxq.profileservice.config.message;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitmqConfig {
  private static final String DEAD_LETTER_EXCHANGE_ARGUMENT = "x-dead-letter-exchange";

  @Value("${profile.exchange}")
  private String topicExchangeName;
  private final String deadLetterExchangeName = topicExchangeName + "-dlq";
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
  public TopicExchange deadLetterExchange() {
    return new TopicExchange(deadLetterExchangeName);
  }

  @Bean
  public Queue deadLetterQueue() {
    return QueueBuilder.durable("dead-letter-queue").build();
  }

  @Bean
  public Queue createQueue() {
    return QueueBuilder.durable(createQueueName)
        .withArgument(DEAD_LETTER_EXCHANGE_ARGUMENT, deadLetterExchangeName)
        .build();
  }

  @Bean
  public Queue updateQueue() {
    return QueueBuilder.durable(updateQueueName)
        .withArgument(DEAD_LETTER_EXCHANGE_ARGUMENT, deadLetterExchangeName)
        .build();
  }

  @Bean
  public Queue imageUploadQueue() {
    return QueueBuilder.durable(imageUploadQueueName)
        .withArgument(DEAD_LETTER_EXCHANGE_ARGUMENT, deadLetterExchangeName)
        .build();
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
  public Binding deadLetterBinding(Queue deadLetterQueue, TopicExchange deadLetterExchange) {
    return BindingBuilder.bind(deadLetterQueue).to(deadLetterExchange).with("#");
  }

  @Bean
  public MessageConverter messageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter);
    factory.setDefaultRequeueRejected(false);
    return factory;
  }
}
