package org.maxq.authorization.config.client;

import feign.Logger;
import feign.auth.BasicAuthRequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailgunClientConfig {

  private final String mailgunUsername;
  private final String mailgunApiKey;

  public MailgunClientConfig(
      @Value("${mailgun.api-key}") String mailgunApiKey,
      @Value("${mailgun.username}") String mailgunUsername) {
    this.mailgunApiKey = mailgunApiKey;
    this.mailgunUsername = mailgunUsername;
  }

  @Bean
  public BasicAuthRequestInterceptor basicAuthRequestInterceptor() {
    return new BasicAuthRequestInterceptor(mailgunUsername, mailgunApiKey);
  }

  @Bean
  public Logger.Level loggerLevel() {
    return Logger.Level.FULL;
  }
}
