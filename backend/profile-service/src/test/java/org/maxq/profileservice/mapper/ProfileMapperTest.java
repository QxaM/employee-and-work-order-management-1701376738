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
    Profile profile = new Profile("test@test.com", "test", "testMiddleName", "testLastName");

    // When
    ProfileDto profileDto = profileMapper.mapToProfileDto(profile);

    // Then
    assertAll(
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
    Profile profile = new Profile("test@test.com", "test", "testLastName");

    // When
    ProfileDto profileDto = profileMapper.mapToProfileDto(profile);

    // Then
    assertAll(
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
}