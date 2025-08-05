package org.maxq.apigatewayservice.controller.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.stream.Collectors;

@Component
@Order(1)
public class UserJwtFilter implements GlobalFilter {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    return exchange.getPrincipal()
        .map(principal -> {
          UsernamePasswordAuthenticationToken userToken =
              (UsernamePasswordAuthenticationToken) principal;
          User userAuthorities = (User) userToken.getPrincipal();
          Collection<GrantedAuthority> grantedAuthorities = userAuthorities.getAuthorities();

          ServerHttpRequest mutatedRequest = exchange.getRequest()
              .mutate()
              .header("X-User", userAuthorities.getUsername())
              .header("X-User-Roles",
                  grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
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
