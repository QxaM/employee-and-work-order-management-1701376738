package org.maxq.authorization.security.authentication.converter;

import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.maxq.authorization.utils.RequestUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
@RequiredArgsConstructor
public class JwtBasicAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  // username and password = 2
  private final static int REQUIRED_CREDENTIALS_LENGTH = 2;

  private final AuthenticationProvider authenticationProvider;

  @Override
  public AbstractAuthenticationToken convert(@NonNull Jwt source) {
    HttpServletRequest request = RequestUtils.getCurrentHttpRequest();
    if (request == null) {
      throw new BadCredentialsException("No request found");
    }

    String basicHeader = request.getHeader("X-Basic-Authorization");
    if (basicHeader == null || basicHeader.isBlank()) {
      throw new BadCredentialsException("No basic authorization header found");
    }

    String credentials = new String(Base64.getDecoder().decode(basicHeader));
    String[] credentialsSplit = credentials.split(":");

    if (credentialsSplit.length != REQUIRED_CREDENTIALS_LENGTH) {
      throw new BadCredentialsException("Invalid basic authorization header");
    }

    Authentication authentication =
        authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(credentialsSplit[0], credentialsSplit[1]));

    UserDetails userDetails = (UserDetails) authentication.getPrincipal();

    return UsernamePasswordAuthenticationToken.authenticated(userDetails, null, userDetails.getAuthorities());
  }
}
