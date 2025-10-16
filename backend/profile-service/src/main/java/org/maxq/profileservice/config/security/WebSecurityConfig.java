package org.maxq.profileservice.config.security;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.config.controller.CustomAccessDeniedHandler;
import org.maxq.profileservice.config.controller.CustomAuthenticationFailureHandler;
import org.maxq.profileservice.security.authentication.converter.JwtHeadersAuthenticationConverter;
import org.maxq.profileservice.security.validator.RobotJwtValidator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.context.request.RequestContextListener;

import java.security.interfaces.RSAPublicKey;

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
    OAuth2TokenValidator<Jwt> customValidator = new RobotJwtValidator();
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
