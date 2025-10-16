package org.maxq.apigatewayservice.config;

import org.maxq.apigatewayservice.ApiGatewayServiceApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.cloud.loadbalancer.support.ServiceInstanceListSuppliers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;

@Configuration(proxyBeanMethods = false)
@EnableAutoConfiguration
@LoadBalancerClient(
    name = "authorization-service",
    configuration = ServiceLoadBalancerConfig.LoadBalancerConfig.class
)
@Import(ApiGatewayServiceApplication.class)
public class ServiceLoadBalancerConfig {

  protected static class LoadBalancerConfig {
    @Bean
    @ConditionalOnProperty(value = "test.loadbalancer", havingValue = "authorization")
    public ServiceInstanceListSupplier authorizationServiceInstanceListSupplier(Environment env) {
      return ServiceInstanceListSuppliers.from("test-load-balancer",
          new DefaultServiceInstance(
              "authorization-service-1",
              "authorization-service",
              "localhost", 8081, false
          )
      );
    }

    @Bean
    @ConditionalOnProperty(value = "test.loadbalancer", havingValue = "profile")
    public ServiceInstanceListSupplier profileServiceInstanceListSupplier(Environment env) {
      return ServiceInstanceListSuppliers.from("test-load-balancer",
          new DefaultServiceInstance(
              "profile-service-1",
              "profile-service",
              "localhost", 8082, false
          )
      );
    }
  }
}

