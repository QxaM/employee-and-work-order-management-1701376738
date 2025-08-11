package org.maxq.profileservice.service;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest
class ProfileServiceTest {

  Profile profile
      = new Profile("test@test.com", "TestName", "testMiddleName", "TestLastName");
  @Autowired
  private ProfileService profileService;
  @MockitoBean
  private ProfileRepository profileRepository;

  @Test
  void shouldReturnProfile_When_ProfileExits() throws ElementNotFoundException {
    // Given
    when(profileRepository.findByEmail(profile.getEmail())).thenReturn(Optional.of(profile));

    // When
    Profile foundProfile = profileService.getProfileByEmail(profile.getEmail());

    // Then
    assertAll(
        () -> assertEquals(profile.getEmail(), foundProfile.getEmail(),
            "Profile should save with equal email"),
        () -> assertEquals(profile.getFirstName(), foundProfile.getFirstName(),
            "Profile should save with equal first name"),
        () -> assertEquals(profile.getMiddleName(), foundProfile.getMiddleName(),
            "Profile should save with equal middle name"),
        () -> assertEquals(profile.getLastName(), foundProfile.getLastName(),
            "Profile should save with equal last name")
    );
  }

  @Test
  void shouldThrow_When_ProfileDoesNotExist() {
    // Given
    when(profileRepository.findByEmail(anyString())).thenReturn(Optional.empty());

    // When + Then
    assertThrows(ElementNotFoundException.class,
        () -> profileService.getProfileByEmail(profile.getEmail())
    );
  }
}