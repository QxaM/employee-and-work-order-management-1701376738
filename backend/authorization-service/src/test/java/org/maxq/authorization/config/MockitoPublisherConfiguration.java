package org.maxq.authorization.config;


import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import static org.mockito.Mockito.mock;

@TestConfiguration
public class MockitoPublisherConfiguration {

  @Bean
  @Primary
  ApplicationEventPublisher publisher() {
    return mock(ApplicationEventPublisher.class);
  }
}