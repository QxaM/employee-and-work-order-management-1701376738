package org.maxq.profileservice.config.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.config.controller.CustomAccessDeniedHandler;
import org.maxq.profileservice.config.controller.CustomAuthenticationFailureHandler;
import org.maxq.profileservice.security.authentication.converter.JwtHeadersAuthenticationConverter;
import org.maxq.profileservice.security.validator.RobotJwtValidator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.interfaces.RSAPublicKey;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
@Slf4j
public class WebSecurityConfig {

  @Value("${frontend.url}")
  private String frontendUrl;

  @Bean
  public SecurityFilterChain filterChainHeaders(
      HttpSecurity http,
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
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
    OAuth2TokenValidator<Jwt> combinedValidator = new DelegatingOAuth2TokenValidator<>(withIssuer,
        customValidator);

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

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration corsConfiguration = new CorsConfiguration();

    log.info("Frontend url: {}", frontendUrl);

    corsConfiguration.setAllowedOriginPatterns(
        List.of("http://localhost:[*]", frontendUrl)
    );
    corsConfiguration.setAllowedMethods(
        List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    corsConfiguration.setAllowedHeaders(List.of("*"));
    corsConfiguration.setExposedHeaders(
        List.of("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
    corsConfiguration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/actuator/health", corsConfiguration);

    return source;
  }
}
