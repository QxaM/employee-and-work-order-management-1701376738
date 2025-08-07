package org.maxq.apigatewayservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.apigatewayservice.domain.LongLastingToken;
import org.maxq.apigatewayservice.service.TokenService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/service")
@RequiredArgsConstructor
@Profile({"DEV"})
public class TokenController {

  public final TokenService tokenService;

  @PostMapping("/long-token")
  public Mono<LongLastingToken> generateToken(@RequestParam int days) {
    return Mono.just(new LongLastingToken(
        tokenService.generateLongLastingToken(days)
    ));
  }
}
