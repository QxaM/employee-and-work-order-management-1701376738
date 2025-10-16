package org.maxq.profileservice.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProfileMapperTest {

  @Autowired
  private ProfileMapper profileMapper;

  @Test
  void shouldMapToProfileDto() {
    // Given
    Profile profile = new Profile(1L, "test@test.com", "test", "testMiddleName", "testLastName");

    // When
    ProfileDto profileDto = profileMapper.mapToProfileDto(profile);

    // Then
    assertAll(
        () -> assertEquals(profile.getId(), profileDto.getId(),
            "Profile should map equal id"),
        () -> assertEquals(profile.getEmail(), profileDto.getEmail(),
            "Profile should map equal email"),
        () -> assertEquals(profile.getFirstName(), profileDto.getFirstName(),
            "Profile should map equal first name"),
        () -> assertEquals(profile.getMiddleName(), profileDto.getMiddleName(),
            "Profile should map equal middle name"),
        () -> assertEquals(profile.getLastName(), profileDto.getLastName(),
            "Profile should map equal last name")
    );
  }

  @Test
  void shouldMapToProfileDto_When_MiddleNameNull() {
    // Given
    Profile profile = new Profile(1L, "test@test.com", "test", null, "testLastName");

    // When
    ProfileDto profileDto = profileMapper.mapToProfileDto(profile);

    // Then
    assertAll(
        () -> assertEquals(profile.getId(), profileDto.getId(),
            "Profile should map equal id"),
        () -> assertEquals(profile.getEmail(), profileDto.getEmail(),
            "Profile should map equal email"),
        () -> assertEquals(profile.getFirstName(), profileDto.getFirstName(),
            "Profile should map equal first name"),
        () -> assertNull(profileDto.getMiddleName(),
            "Profile should be mapped to null"),
        () -> assertEquals(profile.getLastName(), profileDto.getLastName(),
            "Profile should map equal last name")
    );
  }

  @Test
  void shouldMapToProfile() {
    // Given
    ProfileDto profileDto = new ProfileDto(
        1L,
        "test@test.com",
        "test",
        "testMiddleName",
        "testLastName");

    // When
    Profile profile = profileMapper.mapToProfile(profileDto);

    // Then
    assertAll(
        () -> assertEquals(profileDto.getId(), profile.getId(),
            "Profile should map equal id"),
        () -> assertEquals(profileDto.getEmail(), profile.getEmail(),
            "Profile should map equal email"),
        () -> assertEquals(profileDto.getFirstName(), profile.getFirstName(),
            "Profile should map equal first name"),
        () -> assertEquals(profileDto.getMiddleName(), profile.getMiddleName(),
            "Profile should map equal middle name"),
        () -> assertEquals(profileDto.getLastName(), profile.getLastName(),
            "Profile should map equal last name")
    );
  }

  @Test
  void shouldMapToProfile_When_MiddleNameNull() {
    // Given
    ProfileDto profileDto = new ProfileDto(
        1L,
        "test@test.com",
        "test",
        null,
        "testLastName");

    // When
    Profile profile = profileMapper.mapToProfile(profileDto);

    // Then
    assertAll(
        () -> assertEquals(profileDto.getId(), profile.getId(),
            "Profile should map equal id"),
        () -> assertEquals(profileDto.getEmail(), profile.getEmail(),
            "Profile should map equal email"),
        () -> assertEquals(profileDto.getFirstName(), profile.getFirstName(),
            "Profile should map equal first name"),
        () -> assertNull(profileDto.getMiddleName(), "Profile should map null when middle name is null"),
        () -> assertEquals(profileDto.getLastName(), profile.getLastName(),
            "Profile should map equal last name")
    );
  }
}