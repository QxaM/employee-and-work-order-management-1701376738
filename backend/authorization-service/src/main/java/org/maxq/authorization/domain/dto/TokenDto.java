package org.maxq.authorization.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class TokenDto {

  private static final String DEFAULT_TYPE = "Bearer";
  private static final Long DEFAULT_EXPIRY = 3600L;

  private String token;
  private String type;
  private Long expiresIn;

  public TokenDto(String token) {
    this.token = token;
    this.type = DEFAULT_TYPE;
    this.expiresIn = DEFAULT_EXPIRY;
  }
}
