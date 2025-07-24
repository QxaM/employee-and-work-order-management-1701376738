package org.maxq.authorization.security.config;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.config.CustomAccessDeniedHandler;
import org.maxq.authorization.controller.config.CustomAuthenticationFailureHandler;
import org.maxq.authorization.security.UserDetailsDbService;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.interfaces.RSAPublicKey;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  @Value("${frontend.url}")
  private String frontendUrl;

  @Bean
  public AuthenticationProvider authenticationProvider(UserService userService) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder());
    provider.setUserDetailsService(userDetailsService(userService));
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
  public SecurityFilterChain filterChain(HttpSecurity http, RSAPublicKey publicKey) throws Exception {
    http.authorizeHttpRequests(
            authorizeRequests -> authorizeRequests
                .requestMatchers("/login").authenticated()
                .requestMatchers("/users/**").hasRole("ADMIN")
                .requestMatchers("/roles/**").hasRole("ADMIN")
                .anyRequest().permitAll())
        .oauth2ResourceServer(oauth2 ->
            oauth2.jwt(jwtConfigurer ->
                    jwtConfigurer.decoder(nimbusJwtDecoder(publicKey)))
                .authenticationEntryPoint(authenticationFailureHandler()))
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .httpBasic(basic -> basic
            .authenticationEntryPoint(authenticationFailureHandler()))
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(authenticationFailureHandler())
            .accessDeniedHandler(accessDeniedHandler()));
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration corsConfiguration = new CorsConfiguration();

    corsConfiguration.setAllowedOriginPatterns(
        List.of("http://localhost:[*]", frontendUrl)
    );
    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    corsConfiguration.setAllowedHeaders(List.of("*"));
    corsConfiguration.setExposedHeaders(List.of("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
    corsConfiguration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);

    return source;
  }

  @Bean
  public JwtDecoder nimbusJwtDecoder(RSAPublicKey publicKey) {
    return NimbusJwtDecoder.withPublicKey(publicKey).build();
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
    grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
    grantedAuthoritiesConverter.setAuthorityPrefix("");

    JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
    authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return authenticationConverter;
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
