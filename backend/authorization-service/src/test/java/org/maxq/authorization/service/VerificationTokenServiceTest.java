package org.maxq.authorization.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

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
    Role role = new Role(1L, "admin", Collections.emptyList());
    user = new User(1L, "test@test.com", "test", false, Set.of(role));
    token = new VerificationToken(1L, "token", user, LocalDateTime.now(), false);
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
        2L, "token2", user, LocalDateTime.now().minusHours(1L), false
    );
    when(verificationTokenRepository.findAllByUser(any(User.class))).thenReturn(List.of(token, token2));

    // When
    VerificationToken foundToken = verificationTokenService.getTokenByUser(user);

    // Then
    assertEquals(token.getId(), foundToken.getId(), "Token ID should match!");
  }

  @Test
  void shouldSkipUsedTokens() throws ElementNotFoundException {
    // Given
    VerificationToken token2 = new VerificationToken(
        2L, "token2", user, LocalDateTime.now().plusHours(1L), true
    );
    when(verificationTokenRepository.findAllByUser(any(User.class))).thenReturn(List.of(token, token2));

    // When
    VerificationToken foundToken = verificationTokenService.getTokenByUser(user);

    // Then
    assertEquals(token.getId(), foundToken.getId(), "Token ID should match unused token!");
  }

  @Test
  void shouldUnexpiredTokensOnly() {
    // Given
    VerificationToken token1 = new VerificationToken(
        1L, "token1", user, LocalDateTime.now().minusMinutes(24L * 60), false
    );
    VerificationToken token2 = new VerificationToken(
        2L, "token2", user, LocalDateTime.now().minusMinutes(24L * 60), false
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
  void shouldSetUsed() {
    // Given
    when(verificationTokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));

    // When
    verificationTokenService.setUsed(token);

    // Then
    verify(verificationTokenRepository, times(1)).save(any(VerificationToken.class));
    verify(verificationTokenRepository).save(argThat(VerificationToken::isUsed));
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
        LocalDateTime.now().minusMinutes(24 * 60).plusMinutes(1), false);

    // When
    Executable executable = () -> verificationTokenService.validateToken(nonExpiredToken);

    // Then
    assertDoesNotThrow(executable);
  }

  @Test
  void shouldThrow_When_TokenExpired() {
    // Given
    VerificationToken expired = new VerificationToken(1L, "token", user,
        LocalDateTime.now().minusMinutes(24 * 60).minusMinutes(1), false);

    // When
    Executable executable = () -> verificationTokenService.validateToken(expired);

    // Then
    assertThrows(ExpiredVerificationToken.class, executable);
  }

  @Test
  void shouldThrow_When_TokenAlreadyUser() {
    // Given
    VerificationToken usedToken = new VerificationToken(1L, "token", user,
        LocalDateTime.now(), true);

    // When
    Executable executable = () -> verificationTokenService.validateToken(usedToken);

    // Then
    assertThrows(ExpiredVerificationToken.class, executable);
  }
}
