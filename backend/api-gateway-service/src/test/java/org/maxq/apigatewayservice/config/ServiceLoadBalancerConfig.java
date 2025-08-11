package org.maxq.apigatewayservice.config;

import org.maxq.apigatewayservice.ApiGatewayServiceApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
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
    configuration = AuthorizationServiceLoadBalancerConfig.LoadBalancerConfig.class
)
@Import(ApiGatewayServiceApplication.class)
public class AuthorizationServiceLoadBalancerConfig {

  protected static class LoadBalancerConfig {
    @Bean
    public ServiceInstanceListSupplier fixedServiceInstanceListSupplier(Environment env) {
      return ServiceInstanceListSuppliers.from("authorization-service",
          new DefaultServiceInstance("authorization-service-1", "authorization-service",
              "localhost", 8081, false));
    }
  }
}

