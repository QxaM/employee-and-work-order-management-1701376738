package com.qxam.workmanagement.security.config;

import com.qxam.workmanagement.security.CustomUserDetails;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(
            requests ->
                requests
                    .requestMatchers("/templates/**")
                    .permitAll()
                    .requestMatchers("/node_modules/**")
                    .permitAll()
                    .requestMatchers("/images/**")
                    .permitAll()
                    .requestMatchers("/favicon.ico")
                    .permitAll()
                    .requestMatchers("/")
                    .permitAll()
                    .requestMatchers("/register/**")
                    .permitAll()
                    .requestMatchers("/index")
                    .permitAll()
                    .requestMatchers("/error/**")
                    .permitAll())
        .formLogin(
            loginForm ->
                loginForm
                    .loginPage("/login")
                    .loginProcessingUrl("/login")
                    .defaultSuccessUrl("/")
                    .permitAll())
        .logout(
            logout ->
                logout.logoutRequestMatcher(new AntPathRequestMatcher("/logout")).permitAll());
    return http.build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Collections.singletonList("*"));
    configuration.setAllowedMethods(Collections.singletonList("*"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedHeaders(Collections.singletonList("*"));
    configuration.setMaxAge(3600L);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  CustomUserDetails customUserDetails() {
    return new CustomUserDetails();
  }

  @Bean
  AuthenticationFailureHandler simpleFailureHandler() {
    SimpleUrlAuthenticationFailureHandler failureHandler =
        new SimpleUrlAuthenticationFailureHandler();
    failureHandler.setUseForward(true);
    return failureHandler;
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();
  }
}
