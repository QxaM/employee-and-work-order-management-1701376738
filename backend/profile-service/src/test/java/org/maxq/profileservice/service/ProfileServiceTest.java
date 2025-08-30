package org.maxq.profileservice.service;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.exception.DataValidationException;
import org.maxq.profileservice.domain.exception.DuplicateEmailException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.TransactionSystemException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

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

  @Test
  void shouldSave_When_CorrectProfile() {
    // Given
    when(profileRepository.save(profile)).thenReturn(profile);

    // When + Then
    assertDoesNotThrow(() -> profileService.createProfile(profile));
    verify(profileRepository, times(1)).save(profile);
  }

  @Test
  void shouldThrow_When_TransactionException() {
    // Given
    doThrow(new TransactionSystemException("Test error")).when(profileRepository).save(profile);

    // When + Then
    assertThrows(DataValidationException.class,
        () -> profileService.createProfile(profile)
    );
    verify(profileRepository, times(1)).save(profile);
  }

  @Test
  void shouldThrow_When_DataIntegrityViolationException() {
    // Given
    doThrow(new DataIntegrityViolationException("Test error")).when(profileRepository).save(profile);

    // When + Then
    assertThrows(DuplicateEmailException.class,
        () -> profileService.createProfile(profile)
    );
    verify(profileRepository, times(1)).save(profile);
  }
}