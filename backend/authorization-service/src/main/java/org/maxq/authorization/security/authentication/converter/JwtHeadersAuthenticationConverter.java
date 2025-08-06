package org.maxq.authorization.security.authentication.converter;

import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import org.maxq.authorization.security.authentication.token.HeaderAuthenticationToken;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class JwtHeadersAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  @Override
  public AbstractAuthenticationToken convert(@NonNull Jwt source) {
    HttpServletRequest request = getCurrentHttpRequest();
    if (request == null) {
      return new HeaderAuthenticationToken(null, Collections.emptyList(), true);
    }

    String username = request.getHeader("X-User");
    String userRolesHeader = request.getHeader("X-User-Roles");

    if (username == null || username.isBlank()) {
      return new HeaderAuthenticationToken(null, Collections.emptyList(), true);
    }

    if (userRolesHeader == null || userRolesHeader.isBlank()) {
      return new HeaderAuthenticationToken(username, Collections.emptyList(), true);
    }

    List<String> userRoles = Arrays.stream(userRolesHeader.split(",")).toList();

    if (userRoles.isEmpty()) {
      return new HeaderAuthenticationToken(username, Collections.emptyList(), true);
    }

    return new HeaderAuthenticationToken(
        username,
        userRoles.stream().map(SimpleGrantedAuthority::new).toList(),
        true
    );
  }

  private HttpServletRequest getCurrentHttpRequest() {
    Optional<RequestAttributes> requestAttributes =
        Optional.ofNullable(RequestContextHolder.getRequestAttributes());

    return requestAttributes.map(attributes ->
        ((ServletRequestAttributes) attributes).getRequest()).orElse(null);
  }
}
