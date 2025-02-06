package org.maxq.authorization.service;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class VerificationTokenServiceTest {

  @Autowired
  private VerificationTokenService verificationTokenService;

  @MockBean
  private VerificationTokenRepository verificationTokenRepository;

  @Test
  void shouldSaveToken() {
    // Given
    User user = new User(1L, "test@test.com", "test", false);
    VerificationToken token = new VerificationToken(1L, "token", user, LocalDateTime.now());
    when(verificationTokenRepository.save(any(VerificationToken.class))).thenReturn(token);

    // When
    VerificationToken foundToken = verificationTokenService.createToken(user);

    // Then
    assertAll(() -> {
          assertEquals(token.getId(), foundToken.getId(), "Token ID should match!");
          assertEquals(token.getToken(), foundToken.getToken(), "Token should match!");
          assertEquals(token.getUser().getId(), foundToken.getUser().getId(), "User ID should match!");
          assertEquals(token.getCreationDate(), foundToken.getCreationDate(), "Creation date should match!");
        }
    );
  }
}
