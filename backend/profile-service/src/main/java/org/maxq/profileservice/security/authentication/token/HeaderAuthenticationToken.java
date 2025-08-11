package org.maxq.profileservice.security.authentication.token;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Objects;

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

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    if (!super.equals(o)) {
      return false;
    }

    HeaderAuthenticationToken that = (HeaderAuthenticationToken) o;
    return Objects.equals(principal, that.principal);
  }

  @Override
  public int hashCode() {
    int result = super.hashCode();
    result = 31 * result + Objects.hashCode(principal);
    return result;
  }
}
