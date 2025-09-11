package org.maxq.profileservice.security.authentication.token;

import lombok.EqualsAndHashCode;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@EqualsAndHashCode(callSuper = true)
public class HeaderAuthenticationToken extends AbstractAuthenticationToken {

  private final String principal;

  public HeaderAuthenticationToken(String principal,
                                   Collection<? extends GrantedAuthority> authorities, boolean authenticated) {
    super(authorities);
    this.principal = principal;
    setAuthenticated(authenticated);
  }

  @Override
  public Object getCredentials() {
    return null;
  }

  @Override
  public Object getPrincipal() {
    return principal;
  }
}
