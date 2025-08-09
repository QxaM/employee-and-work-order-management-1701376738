package org.maxq.apigatewayservice.controller.config;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.maxq.apigatewayservice.domain.HttpErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


@Slf4j
@Component
public class CustomAuthenticationFailureHandler implements ServerAuthenticationEntryPoint {

  @Override
  public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
    HttpErrorMessage message =
        new HttpErrorMessage("Unauthorized to access this resource, login please");
    log.error("Error during authentication {}", ex.getMessage(), ex);

    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
    exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

    return exchange.getResponse().writeWith(
        Mono.just(exchange.getResponse().bufferFactory().wrap(
            new Gson().toJson(message).getBytes())
        ));
  }
}
