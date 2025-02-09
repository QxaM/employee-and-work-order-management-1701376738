package org.maxq.authorization.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class VerificationTokenServiceTest {

  @Autowired
  private VerificationTokenService verificationTokenService;

  @MockBean
  private VerificationTokenRepository verificationTokenRepository;

  private User user;
  private VerificationToken token;

  @BeforeEach
  void setUp() {
    user = new User(1L, "test@test.com", "test", false);
    token = new VerificationToken(1L, "token", user, LocalDateTime.now());
  }

  @Test
  void shouldSaveToken() {
    // Given
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

  @Test
  void shouldGetToken() throws ElementNotFoundException {
    // Given
    when(verificationTokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));

    // When
    VerificationToken foundToken = verificationTokenService.getToken(token.getToken());

    // Then
    assertAll(() -> {
          assertEquals(token.getId(), foundToken.getId(), "Token ID should match!");
          assertEquals(token.getToken(), foundToken.getToken(), "Token should match!");
          assertEquals(token.getUser().getId(), foundToken.getUser().getId(), "User ID should match!");
          assertEquals(token.getCreationDate(), foundToken.getCreationDate(), "Creation date should match!");
        }
    );
  }

  @Test
  void shouldThrow_When_TokenNotReturned() {
    // Given
    when(verificationTokenRepository.findByToken(token.getToken())).thenReturn(Optional.empty());

    // When
    Executable executable = () -> verificationTokenService.getToken(token.getToken());

    // Then
    assertThrows(ElementNotFoundException.class, executable);
  }

  @Test
  void shouldReturnNewestToken_FromList() throws ElementNotFoundException {
    // Given
    VerificationToken token2 = new VerificationToken(
        2L, "token2", user, LocalDateTime.now().minusHours(1L)
    );
    when(verificationTokenRepository.findAllByUser(any(User.class))).thenReturn(List.of(token, token2));

    // When
    VerificationToken foundToken = verificationTokenService.getTokenByUser(user);

    // Then
    assertEquals(token.getId(), foundToken.getId(), "Token ID should match!");
  }

  @Test
  void shouldUnexpiredTokensOnly() {
    // Given
    VerificationToken token1 = new VerificationToken(
        1L, "token1", user, LocalDateTime.now().minusMinutes(24L * 60)
    );
    VerificationToken token2 = new VerificationToken(
        2L, "token2", user, LocalDateTime.now().minusMinutes(24L * 60)
    );
    when(verificationTokenRepository.findAllByUser(any(User.class))).thenReturn(List.of(token1, token2));

    // When
    Executable executable = () -> verificationTokenService.getTokenByUser(user);

    // Then
    assertThrows(ElementNotFoundException.class, executable);
  }

  @Test
  void shouldUpdateToken() throws ElementNotFoundException {
    // Given
    when(verificationTokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));

    // When
    LocalDateTime newDate = LocalDateTime.now().plusMinutes(10L);
    verificationTokenService.updateCreationDate(token.getToken(), newDate);

    // Then
    verify(verificationTokenRepository).save(argThat(vt -> vt.getCreationDate().isEqual(newDate)));
  }

  @Test
  void shouldThrow_When_TokenNotFound_DuringUpdate() {
    // Given
    when(verificationTokenRepository.findByToken(any(String.class))).thenReturn(Optional.empty());

    // When
    Executable executable = () -> verificationTokenService.updateCreationDate("token", LocalDateTime.now());

    // Then
    assertThrows(ElementNotFoundException.class, executable);
  }

  @Test
  void shouldNotThrow_When_TokenNotExpired() {
    // Given
    VerificationToken nonExpiredToken = new VerificationToken(1L, "token", user,
        LocalDateTime.now().minusMinutes(24 * 60).plusMinutes(1));

    // When
    Executable executable = () -> verificationTokenService.validateToken(nonExpiredToken);

    // Then
    assertDoesNotThrow(executable);
  }

  @Test
  void shouldThrow_When_TokenExpired() {
    // Given
    VerificationToken nonExpiredToken = new VerificationToken(1L, "token", user,
        LocalDateTime.now().minusMinutes(24 * 60).minusMinutes(1));

    // When
    Executable executable = () -> verificationTokenService.validateToken(nonExpiredToken);

    // Then
    assertThrows(ExpiredVerificationToken.class, executable);
  }
}
