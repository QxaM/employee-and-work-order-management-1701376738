package org.maxq.apigatewayservice.controller.config;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.maxq.apigatewayservice.domain.HttpErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class CustomAccessDeniedHandler implements ServerAccessDeniedHandler {

  @Override
  public Mono<Void> handle(ServerWebExchange exchange, AccessDeniedException denied) {
    HttpErrorMessage message = new HttpErrorMessage(
        "Forbidden: You don't have permission to access this resource"
    );
    log.error("Exception during Authorization: {}", denied.getMessage(), denied);

    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
    exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

    return exchange.getResponse().writeWith(
        Mono.just(exchange.getResponse().bufferFactory().wrap(
            new Gson().toJson(message).getBytes())
        ));
  }
}
