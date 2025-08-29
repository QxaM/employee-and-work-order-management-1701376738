package org.maxq.authorization.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Profile;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProfileMapperTest {

  @Autowired
  private ProfileMapper mapper;

  @Test
  void shouldMapToProfile() {
    // Given
    UserDto user = new UserDto("Test", "Middle", "User", "test@test.com", "test");

    // When
    Profile profile = mapper.mapToProfile(user);

    // Then
    assertAll(
        () -> assertEquals(user.getEmail(), profile.getEmail(),
            "Emails should match after mapping"),
        () -> assertEquals(user.getFirstName(), profile.getFirstName(),
            "First names should match after mapping"),
        () -> assertEquals(user.getMiddleName(), profile.getMiddleName(),
            "Middle names should match after mapping"),
        () -> assertEquals(user.getLastName(), profile.getLastName(),
            "Last names should match after mapping")
    );
  }

  @Test
  void shouldMapToProfile_When_MiddleNameIsNull() {
    // Given
    UserDto user = new UserDto("Test", null, "User", "test@test.com", "test");

    // When
    Profile profile = mapper.mapToProfile(user);

    // Then
    assertAll(
        () -> assertEquals(user.getEmail(), profile.getEmail(),
            "Emails should match after mapping"),
        () -> assertEquals(user.getFirstName(), profile.getFirstName(),
            "First names should match after mapping"),
        () -> assertNull(profile.getMiddleName(),
            "Middle names should be null if null provided"),
        () -> assertEquals(user.getLastName(), profile.getLastName(),
            "Last names should match after mapping")
    );
  }
}
