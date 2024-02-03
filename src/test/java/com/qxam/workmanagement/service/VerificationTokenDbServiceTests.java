package com.qxam.workmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.VerificationToken;
import com.qxam.workmanagement.domain.exception.ElementNotFound;
import com.qxam.workmanagement.repository.VerificationTokenRepository;
import java.util.Optional;
import java.util.UUID;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class VerificationTokenDbServiceTests {

  @Autowired private VerificationTokenDbService service;

  @MockBean private VerificationTokenRepository repository;

  private static VerificationToken token;

  private static User user;

  @BeforeAll
  static void createData() {
    user =
        User.builder()
            .id(new ObjectId())
            .email("example@example.com")
            .password("12345")
            .enabled(false)
            .build();

    token = new VerificationToken(new ObjectId(), UUID.randomUUID(), user.getId());
  }

  @Test
  void shouldCreateNewToken() {
    // Given
    when(repository.insert(any(VerificationToken.class))).thenReturn(token);

    // When
    UUID tokenUUID = service.saveNewTokenForUser(user);

    // Then
    assertEquals(token.getToken(), tokenUUID);
  }

  @Test
  void shouldFindToken() throws ElementNotFound {
    // Given
    when(repository.findByToken(token.getToken())).thenReturn(Optional.of(token));

    // When
    VerificationToken foundToken = service.findToken(token.getToken());

    // Then
    assertAll(
        () -> assertEquals(token.getId(), foundToken.getId()),
        () -> assertEquals(token.getToken(), foundToken.getToken()),
        () -> assertEquals(token.getUserId(), foundToken.getUserId()));
  }

  @Test
  void shouldThrow_WhenTokenDoesNotExist() {
    // Given
    when(repository.findByToken(token.getToken())).thenReturn(Optional.empty());

    // When + Then
    assertThrows(ElementNotFound.class, () -> service.findToken(token.getToken()));
  }

  @Test
  void shouldDeleteToken() {
    // Given

    // When
    service.deleteToken(token);

    // Then
    verify(repository, times(1)).deleteById(token.getId());
  }
}
