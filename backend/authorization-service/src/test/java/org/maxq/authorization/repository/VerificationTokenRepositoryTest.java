package org.maxq.authorization.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VerificationTokenRepositoryTest {

  @Autowired
  private VerificationTokenRepository repository;
  @Autowired
  private UserRepository userRepository;

  private User user;
  private VerificationToken token;

  @BeforeEach
  void createData() {
    user = new User("test@test.com", "test", false);
    userRepository.save(user);

    token = new VerificationToken("token", user, LocalDateTime.now());
    repository.save(token);
  }

  @AfterEach
  void deleteData() {
    repository.deleteById(token.getId());
    userRepository.deleteById(user.getId());
  }

  @Test
  void shouldFetchToken() {
    // Given

    // When
    Optional<VerificationToken> foundToken = repository.findByToken("token");

    // Then
    assertTrue(foundToken.isPresent(), "Token was not found!");

    VerificationToken fetchedToken = foundToken.get();
    assertEquals(fetchedToken.getId(), token.getId(),
        "Token was not fetched correctly - invalid ID!");
    assertEquals(fetchedToken.getToken(), token.getToken(),
        "Token was not fetched correctly - invalid Token!");
    assertEquals(fetchedToken.getUser().getId(), token.getUser().getId(),
        "Token was not fetched correctly - invalid User!");
    assertEquals(
        fetchedToken.getCreationDate().truncatedTo(ChronoUnit.SECONDS),
        token.getCreationDate().truncatedTo(ChronoUnit.SECONDS),
        "Token was not fetched correctly - invalid creation date!"
    );
  }

  @Test
  void shouldCreateMultipleTokensForOneUser() {
    // Given
    String tokenString = "token1";
    VerificationToken token1 = new VerificationToken(2L, tokenString, user, LocalDateTime.now());

    // When
    repository.save(token1);
    Optional<VerificationToken> foundToken = repository.findByToken(tokenString);

    // Then
    assertTrue(foundToken.isPresent(), "Token was not found!");

    VerificationToken fetchedToken = foundToken.get();
    assertEquals(fetchedToken.getUser().getId(), token.getUser().getId(),
        "Token was not fetched correctly - invalid User!");
    assertEquals(fetchedToken.getUser().getId(), token1.getUser().getId(),
        "Token was not fetched correctly - invalid User!");

    // Cleanup
    repository.deleteById(token1.getId());
  }

  @Test
  void shouldReturnMultipleTokensForOneUser() {
    // Given
    VerificationToken token2 = new VerificationToken("token2", user, LocalDateTime.now());
    repository.save(token2);

    // when
    List<VerificationToken> foundTokens = repository.findAllByUser(user);

    // Then
    assertAll(() -> {
      assertEquals(2, foundTokens.size(), "Wrong number of tokens found!");
      assertEquals(token.getId(), foundTokens.get(0).getId(), "Token 1 was not found!");
      assertEquals(token2.getId(), foundTokens.get(1).getId(), "Token 2 was not found!");
    });

    // Cleanup
    repository.deleteById(token2.getId());
  }
}
