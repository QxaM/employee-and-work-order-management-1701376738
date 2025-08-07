package org.maxq.apigatewayservice.controller.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Order(2)
public class UserJwtFilter implements GlobalFilter {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    return exchange.getPrincipal()
        .map(principal -> {
          JwtAuthenticationToken userToken =
              (JwtAuthenticationToken) principal;
          Jwt userAuthorities = (Jwt) userToken.getPrincipal();
          List<String> grantedAuthorities = userAuthorities.getClaimAsStringList("roles");

          ServerHttpRequest mutatedRequest = exchange.getRequest()
              .mutate()
              .header("X-User", userAuthorities.getSubject())
              .header("X-User-Roles", String.join(",", grantedAuthorities))
              .build();

          return exchange
              .mutate()
              .request(mutatedRequest)
              .build();
        })
        .defaultIfEmpty(exchange)
        .flatMap(chain::filter);
  }
}
