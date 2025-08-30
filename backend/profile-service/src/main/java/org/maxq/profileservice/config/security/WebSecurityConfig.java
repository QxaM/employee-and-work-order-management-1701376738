package org.maxq.profileservice.config.security;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.config.controller.CustomAccessDeniedHandler;
import org.maxq.profileservice.config.controller.CustomAuthenticationFailureHandler;
import org.maxq.profileservice.security.authentication.converter.JwtHeadersAuthenticationConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.context.request.RequestContextListener;

import java.security.interfaces.RSAPublicKey;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

  @Bean
  public SecurityFilterChain filterChainHeaders(HttpSecurity http,
                                                @Qualifier("robot") RSAPublicKey publicKey,
                                                JwtHeadersAuthenticationConverter jwtHeadersAuthenticationConverter) throws Exception {
    http.securityMatcher("/**")
        .authorizeHttpRequests(
            authorizeRequests -> authorizeRequests
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 ->
            oauth2.jwt(jwtConfigurer ->
                    jwtConfigurer
                        .decoder(nimbusJwtDecoder(publicKey))
                        .jwtAuthenticationConverter(jwtHeadersAuthenticationConverter))
                .authenticationEntryPoint(authenticationFailureHandler()))
        .cors(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(authenticationFailureHandler())
            .accessDeniedHandler(accessDeniedHandler()));
    return http.build();
  }

  @Bean
  public RequestContextListener requestContextListener() {
    return new RequestContextListener();
  }


  @Bean
  public JwtDecoder nimbusJwtDecoder(@Qualifier("robot") RSAPublicKey publicKey) {
    OAuth2TokenValidator<Jwt> withIssuer
        = JwtValidators.createDefaultWithIssuer("api-gateway-service");

    OAuth2TokenValidator<Jwt> customValidator = jwt -> {
      List<OAuth2Error> errors = new ArrayList<>();

      if (!"robot".equals(jwt.getSubject())) {
        errors.add(new OAuth2Error("invalid_subject", "Subject msy be a 'robot'", null));
      }

      if (!"access_token".equals(jwt.getClaimAsString("type"))) {
        errors.add(new OAuth2Error("invalid_type", "Type must be 'access_token'", null));
      }

      return errors.isEmpty()
          ? OAuth2TokenValidatorResult.success()
          : OAuth2TokenValidatorResult.failure(errors.toArray(new OAuth2Error[0]));
    };

    OAuth2TokenValidator<Jwt> combinedValidator = new DelegatingOAuth2TokenValidator<>(withIssuer, customValidator);

    NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(publicKey).build();
    decoder.setJwtValidator(combinedValidator);
    return decoder;
  }

  @Bean
  public AuthenticationEntryPoint authenticationFailureHandler() {
    return new CustomAuthenticationFailureHandler();
  }

  @Bean
  public AccessDeniedHandler accessDeniedHandler() {
    return new CustomAccessDeniedHandler();
  }
}
