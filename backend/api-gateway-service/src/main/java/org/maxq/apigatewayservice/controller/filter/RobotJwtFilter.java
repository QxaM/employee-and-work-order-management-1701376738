package org.maxq.apigatewayservice.controller.filter;

import lombok.RequiredArgsConstructor;
import org.maxq.apigatewayservice.service.TokenService;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Order(3)
@RequiredArgsConstructor
public class RobotJwtFilter implements GlobalFilter {

  private final TokenService tokenService;

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String robotToken = tokenService.generateToken();

    exchange.getRequest().getHeaders().setBearerAuth(robotToken);

    return chain.filter(exchange);
  }
}
