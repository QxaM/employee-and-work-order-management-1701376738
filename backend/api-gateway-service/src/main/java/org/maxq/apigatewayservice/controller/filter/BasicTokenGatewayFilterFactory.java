package org.maxq.apigatewayservice.controller.filter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.OrderedGatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class BasicTokenGatewayFilterFactory extends AbstractGatewayFilterFactory<BasicTokenGatewayFilterFactory.Config> {

  public BasicTokenGatewayFilterFactory() {
    super(Config.class);
  }

  @Override
  public GatewayFilter apply(Config config) {
    return new OrderedGatewayFilter((exchange, chain) -> {
      String basicToken = exchange.getRequest().getHeaders().getFirst("Authorization");

      if (basicToken != null && basicToken.startsWith("Basic ")) {
        String token = basicToken.substring(6);

        ServerHttpRequest mutatedRequest = exchange.getRequest()
            .mutate()
            .header(config.getBasicTokenHeader(), token)
            .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
      }

      return chain.filter(exchange);
    }, 1);
  }

  @AllArgsConstructor
  @Setter
  @Getter
  public static class Config {
    private String basicTokenHeader;
  }
}
