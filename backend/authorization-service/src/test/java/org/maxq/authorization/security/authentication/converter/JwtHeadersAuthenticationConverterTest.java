package org.maxq.authorization.security.authentication.converter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtHeadersAuthenticationConverterTest {

  Jwt jwt = Jwt.withTokenValue("test-token")
      .header("alg", "RS256")
      .subject("robot")
      .issuer("api-gateway-service")
      .claim("type", "access_token")
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();
  @Autowired
  private JwtHeadersAuthenticationConverter converter;

  @Test
  void convert_When_NoRequestFound() {
    // Given

    // When
    AbstractAuthenticationToken token = converter.convert(jwt);

    // Then
    assertNotNull(token, "Token should be returned after any validation");
    assertAll(
        () ->
            assertNull(token.getPrincipal(), "Principal should be null when no request"),
        () -> assertEquals(0, token.getAuthorities().size(), "No authorities should be returned"),
        () -> assertTrue(token.isAuthenticated(), "Token should be authenticated")
    );
  }

  @Test
  void convert_When_RequestHaveNoUserHeaders() {
    // Given
    MockHttpServletRequest request = new MockHttpServletRequest();
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

    // When
    AbstractAuthenticationToken token = converter.convert(jwt);

    // Then
    assertNotNull(token, "Token should be returned after any validation");
    assertAll(
        () ->
            assertNull(token.getPrincipal(), "Principal should be null when no X-User header"),
        () -> assertEquals(0, token.getAuthorities().size(), "No authorities should be returned"),
        () -> assertTrue(token.isAuthenticated(), "Token should be authenticated")
    );
  }

  @Test
  void convert_When_RequestHaveUserHeader_And_NoRoles() {
    // Given
    String username = "test@test.com";
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.addHeader("X-User", username);
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

    // When
    AbstractAuthenticationToken token = converter.convert(jwt);

    // Then
    assertNotNull(token, "Token should be returned after any validation");
    assertAll(
        () ->
            assertEquals(username, token.getPrincipal(),
                "Principal should be returned when X-User header is present"),
        () -> assertEquals(0, token.getAuthorities().size(), "No authorities should be returned"),
        () -> assertTrue(token.isAuthenticated(), "Token should be authenticated")
    );
  }

  @Test
  void convert_When_RequestHaveUserHeaders() {
    // Given
    String username = "test@test.com";
    List<String> roles = List.of("ROLE_OPERATOR", "ROLE_ADMIN");
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.addHeader("X-User", username);
    request.addHeader("X-User-Roles", String.join(",", roles));
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

    // When
    AbstractAuthenticationToken token = converter.convert(jwt);

    // Then
    assertNotNull(token, "Token should be returned after any validation");
    assertAll(
        () ->
            assertEquals(username, token.getPrincipal(),
                "Principal should be null when no request"),
        () -> assertEquals(roles.size(), token.getAuthorities().size(),
            "Authorities should be returned when X-User-Roles header is present"),
        () -> assertArrayEquals(roles.toArray(),
            token.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(),
            "Correct Authorities should be returned when X-User-Roles header is present"),
        () -> assertTrue(token.isAuthenticated(), "Token should be authenticated")
    );
  }

  @Test
  void convert_When_RequestHaveRolesHeaders_And_NoUserHeaders() {
    // Given
    List<String> roles = List.of("ROLE_OPERATOR", "ROLE_ADMIN");
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.addHeader("X-User-Roles", String.join(",", roles));
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

    // When
    AbstractAuthenticationToken token = converter.convert(jwt);

    // Then
    assertNotNull(token, "Token should be returned after any validation");
    assertAll(
        () ->
            assertNull(token.getPrincipal(), "Principal should be null when no request"),
        () -> assertEquals(0, token.getAuthorities().size(), "No authorities should be returned"),
        () -> assertTrue(token.isAuthenticated(), "Token should be authenticated")
    );
  }
}