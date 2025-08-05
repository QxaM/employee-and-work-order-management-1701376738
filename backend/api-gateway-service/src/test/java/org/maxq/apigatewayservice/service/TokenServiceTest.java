package org.maxq.apigatewayservice.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.test.context.TestPropertySource;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@TestPropertySource(properties = {
    "eureka.client.enabled=false"
})
class TokenServiceTest {

  @Autowired
  private TokenService tokenService;

  @Autowired
  private TokenDecoder tokenDecoder;

  @Test
  void generateToken() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    // Given

    // When
    String token = tokenService.generateToken();
    Jwt jwt = tokenDecoder.decodeToken(token);

    // Then
    assertAll(
        () -> assertEquals("robot", jwt.getSubject(),
            "Correct subject should be returned"),
        () -> assertEquals("api-gateway-service", jwt.getClaimAsString("iss"),
            "Correct issuer should be returned"),
        () -> {
          Assertions.assertNotNull(jwt.getIssuedAt(), "Issued at date should be set");
          Assertions.assertNotNull(jwt.getExpiresAt(), "Expires at date should be set");
          assertEquals(
              60,
              jwt.getExpiresAt().getEpochSecond() - jwt.getIssuedAt().getEpochSecond(),
              "Token should expire in 60 seconds");
        },
        () -> assertEquals("access_token", jwt.getClaims().get("type"),
            "Correct JWT type should be returned")
    );
  }
}

@Component
@RequiredArgsConstructor
class TokenDecoder {

  private final ResourceLoader resourceLoader;

  @Value("${jwt.robot-public-key-path}")
  private String publicKeyPath;

  public Jwt decodeToken(String token) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    return NimbusJwtDecoder.withPublicKey(loadPublicKey(publicKeyPath))
        .build().decode(token);
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
}
