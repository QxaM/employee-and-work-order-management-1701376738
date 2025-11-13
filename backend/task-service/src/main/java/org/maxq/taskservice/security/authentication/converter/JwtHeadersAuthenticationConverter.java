package org.maxq.taskservice.security.authentication.converter;

import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import org.maxq.taskservice.security.authentication.token.HeaderAuthenticationToken;
import org.maxq.taskservice.utils.RequestUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class JwtHeadersAuthenticationConverter
    implements Converter<Jwt, AbstractAuthenticationToken> {

  @Override
  public AbstractAuthenticationToken convert(@NonNull Jwt source) {
    HttpServletRequest request = RequestUtils.getCurrentHttpRequest();
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
}
