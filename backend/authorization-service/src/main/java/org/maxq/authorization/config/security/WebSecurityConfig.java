package org.maxq.authorization.config.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.config.controller.CustomAccessDeniedHandler;
import org.maxq.authorization.config.controller.CustomAuthenticationFailureHandler;
import org.maxq.authorization.security.UserDetailsDbService;
import org.maxq.authorization.security.authentication.converter.JwtBasicAuthenticationConverter;
import org.maxq.authorization.security.authentication.converter.JwtHeadersAuthenticationConverter;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.interfaces.RSAPublicKey;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class WebSecurityConfig {

  @Value("${frontend.url}")
  private String frontendUrl;

  @Bean
  public AuthenticationManager authenticationManager(
      DaoAuthenticationProvider daoAuthenticationProvider
  ) {
    return new ProviderManager(List.of(daoAuthenticationProvider));
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider(UserService userService) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(
        userDetailsService(userService));
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }

  @Bean
  public UserDetailsService userDetailsService(UserService userService) {
    return new UserDetailsDbService(userService);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  @Order(1)
  public SecurityFilterChain filterChainLogin(
      HttpSecurity http,
      @Qualifier("robot") RSAPublicKey publicKey,
      JwtBasicAuthenticationConverter jwtBasicAuthenticationConverter) throws Exception {
    http.securityMatcher("/login")
        .authorizeHttpRequests(
            authorizeRequests -> authorizeRequests
                .requestMatchers("/login").authenticated())
        .oauth2ResourceServer(oauth2 ->
            oauth2.jwt(jwtConfigurer ->
                    jwtConfigurer
                        .decoder(nimbusJwtDecoder(publicKey))
                        .jwtAuthenticationConverter(jwtBasicAuthenticationConverter))
                .authenticationEntryPoint(authenticationFailureHandler()))
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(authenticationFailureHandler())
            .accessDeniedHandler(accessDeniedHandler()));
    return http.build();
  }

  @Bean
  @Order(2)
  public SecurityFilterChain filterChainHeaders(
      HttpSecurity http,
      @Qualifier("robot") RSAPublicKey publicKey,
      JwtHeadersAuthenticationConverter jwtHeadersAuthenticationConverter) throws Exception {
    http.securityMatcher("/**")
        .authorizeHttpRequests(
            authorizeRequests -> authorizeRequests
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/users/**").hasRole("ADMIN")
                .requestMatchers("/roles/**").hasRole("ADMIN")
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
    corsConfiguration.setAllowCredentials(true);
    corsConfiguration.setExposedHeaders(
        List.of(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        )
    );
    corsConfiguration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/actuator/health", corsConfiguration);

    return source;
  }
}
