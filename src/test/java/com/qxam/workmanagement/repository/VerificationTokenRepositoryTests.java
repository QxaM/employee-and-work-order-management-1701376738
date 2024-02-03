package com.qxam.workmanagement.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.qxam.workmanagement.domain.VerificationToken;
import java.util.Optional;
import java.util.UUID;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataMongoTest
@TestPropertySource(locations = "classpath:test.properties")
class VerificationTokenRepositoryTests {

  @Autowired private VerificationTokenRepository repository;

  private VerificationToken token;

  @BeforeEach
  void createToken() {
    token = new VerificationToken(new ObjectId(), UUID.randomUUID(), new ObjectId());
  }

  @AfterEach
  void deleteToken() {
    // repository.deleteById(token.getId());
  }

  @Test
  void shouldSaveToken() {
    // Given

    // When
    repository.insert(token);
    Optional<VerificationToken> foundToken = repository.findById(token.getId());

    // Then
    assertTrue(foundToken.isPresent());
    assertEquals(token.getToken(), foundToken.get().getToken());
    assertEquals(token.getUserId(), foundToken.get().getUserId());
  }

  @Test
  void shouldFindToken() {
    // Given
    repository.insert(token);

    // When
    Optional<VerificationToken> foundToken = repository.findByToken(token.getToken());

    // Then
    assertTrue(foundToken.isPresent());
    assertEquals(token.getToken(), foundToken.get().getToken());
    assertEquals(token.getUserId(), foundToken.get().getUserId());
  }

  @Test
  void shouldUpdateToken() {
    // Given
    repository.insert(token);

    // When
    VerificationToken changedToken =
        new VerificationToken(token.getId(), UUID.randomUUID(), new ObjectId());
    repository.save(changedToken);
    Optional<VerificationToken> foundToken = repository.findById(token.getId());

    // Then
    assertTrue(foundToken.isPresent());
    assertEquals(changedToken.getToken(), foundToken.get().getToken());
    assertEquals(changedToken.getUserId(), foundToken.get().getUserId());
  }

  @Test
  void shouldDeleteToken() {
    // Given
    repository.insert(token);

    // When
    repository.deleteById(token.getId());
    Optional<VerificationToken> foundToken = repository.findById(token.getId());

    // Then
    assertTrue(foundToken.isEmpty());
  }
}
