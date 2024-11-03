package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest
class TokenServiceTest {

  @Autowired
  private TokenService tokenService;

  @Autowired
  private TokenDecoder tokenDecoder;

  @Test
  void generateToken() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    // Given
    UserDetails user = new User("test@test.com", "test", List.of(new SimpleGrantedAuthority("ROLE_USER")));

    // When
    String token = tokenService.generateToken(user);
    Jwt jwt = tokenDecoder.decodeToken(token);

    // Then
    assertEquals(user.getUsername(), jwt.getSubject(), "Correct username should be returned");
    assertEquals("access_token", jwt.getClaims().get("type"),
        "Correct JWT type should be returned");

    String role = null;
    if (user.getAuthorities().stream().findFirst().isPresent()) {
      role = user.getAuthorities().stream().findFirst().get().getAuthority();
    } else {
      fail("Roles was not part of the UserDetails!");
    }
    String mappedRole = role.replace("ROLE_", "").toLowerCase();
    String returnedRole = jwt.getClaimAsStringList("roles").getFirst();
    assertEquals(mappedRole, returnedRole, "Correct role should be returned");
  }
}

@Component
@RequiredArgsConstructor
class TokenDecoder {

  private final ResourceLoader resourceLoader;
  @Value("${jwt.public-key-path}")
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