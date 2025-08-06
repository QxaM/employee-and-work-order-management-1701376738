package org.maxq.apigatewayservice.service;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {

  private final JwtEncoder jwtEncoder;
  private final String issuer;

  public TokenService(
      @Value("${jwt.issuer}") String issuer,
      @Qualifier("robot") RSAPublicKey publicKey,
      @Qualifier("robotPrivate") RSAPrivateKey privateKey
  ) {
    this.issuer = issuer;

    RSAKey rsaKey = new RSAKey.Builder(publicKey)
        .privateKey(privateKey)
        .keyID(issuer)
        .build();

    this.jwtEncoder = new NimbusJwtEncoder(
        new ImmutableJWKSet<>(new JWKSet(rsaKey))
    );
  }

  public String generateToken() {
    JwtClaimsSet claimsSet = JwtClaimsSet.builder()
        .issuer(issuer)
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(60))
        .subject("robot")
        .claim("type", "access_token")
        .build();

    return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
  }

  @Profile({"DEV"})
  public String generateLongLastingToken(int days) {
    JwtClaimsSet claimsSet = JwtClaimsSet.builder()
        .issuer(issuer)
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plus(days, ChronoUnit.DAYS))
        .subject("robot")
        .claim("type", "access_token")
        .build();

    return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
  }
}
