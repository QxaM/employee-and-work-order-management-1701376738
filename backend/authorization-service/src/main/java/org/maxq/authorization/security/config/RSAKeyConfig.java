package org.maxq.authorization.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Configuration
public class RSAKeyConfig {

  @Value("${jwt.public-key-path}")
  private String publicKeyPath;

  @Value("${jwt.private-key-path}")
  private String privateKeyPath;

  @Value("${jwt.robot-public-key-path}")
  private String robotPublicKeyPath;

  @Bean(name = "user")
  public RSAPublicKey jwtPublicKey(ResourceLoader resourceLoader) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    return buildPublicKey(resourceLoader, publicKeyPath);
  }

  @Bean
  public RSAPrivateKey jwtPrivateKey(ResourceLoader resourceLoader) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
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

  @Bean(name = "robot")
  public RSAPublicKey robotPublicKey(ResourceLoader resourceLoader) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    return buildPublicKey(resourceLoader, robotPublicKeyPath);
  }

  private RSAPublicKey buildPublicKey(ResourceLoader resourceLoader, String keyPath) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    Resource resource = resourceLoader.getResource(keyPath);
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
