package org.maxq.profileservice.config.controller;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.HttpErrorMessage;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
                       AuthenticationException exception) throws IOException, ServletException {
    HttpErrorMessage message =
        new HttpErrorMessage("Unauthorized to access this resource, login please");
    log.error("Error during authentication {}", exception.getMessage(), exception);
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.getWriter().write(new Gson().toJson(message));
  }
}
