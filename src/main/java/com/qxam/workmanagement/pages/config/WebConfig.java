package com.qxam.workmanagement.pages.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.extras.springsecurity6.dialect.SpringSecurityDialect;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    registry
        .addResourceHandler("/templates/layouts/styles/**")
        .addResourceLocations("classpath:/templates/layouts/styles/");
    registry.addResourceHandler("/node_modules/**").addResourceLocations("file:./node_modules/");
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LayoutInterceptor());
  }

  @Bean
  SpringSecurityDialect springSecurityDialect() {
    return new SpringSecurityDialect();
  }
}
