package org.maxq.authorization.service;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Service
public class TokenService {

  private final JwtEncoder jwtEncoder;
  private final String issuer;
  private final ResourceLoader resourceLoader;

  public TokenService(
      @Value("${jwt.private-key-path}") String privateKeyPath,
      @Value("${jwt.public-key-path}") String publicKeyPath,
      @Value("${jwt.issuer}") String issuer,
      ResourceLoader resourceLoader
  ) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    this.resourceLoader = resourceLoader;

    RSAPrivateKey privateKey = loadPrivateKey(privateKeyPath);
    RSAPublicKey publicKey = loadPublicKey(publicKeyPath);
    this.issuer = issuer;

    RSAKey rsaKey = new RSAKey.Builder(publicKey)
        .privateKey(privateKey)
        .keyID(issuer)
        .build();

    this.jwtEncoder = new NimbusJwtEncoder(
        new ImmutableJWKSet<>(new JWKSet(rsaKey))
    );
  }

  public String generateToken(UserDetails userDetails) {
    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .toList();

    JwtClaimsSet claimsSet = JwtClaimsSet.builder()
        .issuer(issuer)
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .subject(userDetails.getUsername())
        .claim("roles", roles)
        .claim("type", "access_token")
        .build();

    return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
  }

  private RSAPublicKey loadPublicKey(String publicKeyPath) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    Resource resource = resourceLoader.getResource(publicKeyPath);
    String publicKeyContent = new String(resource.getInputStream().readAllBytes())
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replaceAll("\\s", "");

    byte[] decodedPublicKey = Base64.getDecoder().decode(publicKeyContent);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(decodedPublicKey);

    return (RSAPublicKey) keyFactory.generatePublic(publicKeySpec);
  }

  private RSAPrivateKey loadPrivateKey(String privateKeyPath) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    Resource resource = resourceLoader.getResource(privateKeyPath);
    String privateKeyContent = new String(resource.getInputStream().readAllBytes())
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .replaceAll("\\s", "");

    byte[] decodedPrivateKey = Base64.getDecoder().decode(privateKeyContent);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(decodedPrivateKey);

    return (RSAPrivateKey) keyFactory.generatePrivate(privateKeySpec);
  }
}
