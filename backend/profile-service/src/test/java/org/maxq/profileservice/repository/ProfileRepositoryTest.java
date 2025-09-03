package org.maxq.profileservice.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProfileRepositoryTest {

  @Autowired
  private ProfileRepository profileRepository;

  private Profile profile;

  @BeforeEach
  void setUp() {
    profile = new Profile("test@test.com", "TestName", "testMiddleName", "TestLastName");
  }

  @AfterEach
  void tearDown() {
    if (profile.getId() != null) {
      profileRepository.deleteById(profile.getId());
    }
  }

  @Test
  void shouldSaveProfile() {
    // Given
    profileRepository.save(profile);

    // When
    Optional<Profile> foundProfile = profileRepository.findById(profile.getId());

    // Then
    assertTrue(foundProfile.isPresent(), "Profile was not found - not saved properly");
    assertAll(
        () -> assertEquals(profile.getEmail(), foundProfile.get().getEmail(),
            "Profile should save with equal email"),
        () -> assertEquals(profile.getFirstName(), foundProfile.get().getFirstName(),
            "Profile should save with equal first name"),
        () -> assertEquals(profile.getMiddleName(), foundProfile.get().getMiddleName(),
            "Profile should save with equal middle name"),
        () -> assertEquals(profile.getLastName(), foundProfile.get().getLastName(),
            "Profile should save with equal last name")
    );
  }

  @Test
  void shouldSaveProfile_when_MiddleNameNull() {
    // Given
    Profile profileWithoutMiddle = new Profile(profile.getEmail(), profile.getFirstName(), profile.getLastName());
    profileRepository.save(profileWithoutMiddle);

    // When
    Optional<Profile> foundProfile = profileRepository.findById(profileWithoutMiddle.getId());

    // Then
    assertTrue(foundProfile.isPresent(), "Profile was not found - not saved properly");
    assertAll(
        () -> assertEquals(profileWithoutMiddle.getEmail(), foundProfile.get().getEmail(),
            "Profile should save with equal email"),
        () -> assertEquals(profileWithoutMiddle.getFirstName(), foundProfile.get().getFirstName(),
            "Profile should save with equal first name"),
        () -> assertNull(foundProfile.get().getMiddleName(), "Middle name should be null"),
        () -> assertEquals(profileWithoutMiddle.getLastName(), foundProfile.get().getLastName(),
            "Profile should save with equal last name")
    );

    // Clean up
    profileRepository.deleteById(profileWithoutMiddle.getId());
  }

  @Test
  void shouldThrow_When_SavingDuplicates() {
    // Given
    Profile duplicateProfile = new Profile(profile.getEmail(), profile.getFirstName(), profile.getLastName());
    profileRepository.save(profile);

    // When + Then
    assertThrows(
        DataIntegrityViolationException.class,
        () -> profileRepository.save(duplicateProfile),
        "Should throw exception when saving duplicate profile");
  }

  @Test
  void shouldUpdateProfile() {
    // Given
    profileRepository.save(profile);
    Profile updatedProfile = new Profile(
        profile.getId(), profile.getEmail(),
        "UpdatedName", "UpdatedMiddleName", "UpdatedLastName"
    );

    // When
    profileRepository.save(updatedProfile);
    Optional<Profile> foundProfile = profileRepository.findById(profile.getId());

    // Then
    assertTrue(foundProfile.isPresent(), "Profile should be found after update");
    assertAll(
        () -> assertEquals(updatedProfile.getEmail(), foundProfile.get().getEmail(),
            "Profile should save with equal email"),
        () -> assertEquals(updatedProfile.getFirstName(), foundProfile.get().getFirstName(),
            "Profile should save with equal first name"),
        () -> assertEquals(updatedProfile.getMiddleName(), foundProfile.get().getMiddleName(),
            "Middle name should be null"),
        () -> assertEquals(updatedProfile.getLastName(), foundProfile.get().getLastName(),
            "Profile should save with equal last name")
    );
  }

  @Test
  void shouldFindByEmail() {
    // Given
    profileRepository.save(profile);

    // When
    Optional<Profile> foundProfile = profileRepository.findByEmail(profile.getEmail());

    // Then
    assertTrue(foundProfile.isPresent(), "Profile was not found - not saved properly");
    assertAll(
        () -> assertEquals(profile.getEmail(), foundProfile.get().getEmail(),
            "Profile should save with equal email"),
        () -> assertEquals(profile.getFirstName(), foundProfile.get().getFirstName(),
            "Profile should save with equal first name"),
        () -> assertEquals(profile.getMiddleName(), foundProfile.get().getMiddleName(),
            "Profile should save with equal middle name"),
        () -> assertEquals(profile.getLastName(), foundProfile.get().getLastName(),
            "Profile should save with equal last name")
    );
  }

  @Test
  void shouldReturnEmpty_When_ProfileDoesNotExist_And_FindByEmail() {
    // Given

    // When
    Optional<Profile> foundProfile = profileRepository.findByEmail(profile.getEmail());

    // Then
    assertFalse(foundProfile.isPresent(), "Profile was not found - not saved properly");
  }

  @Test
  void shouldFindById() {
    // Given
    profileRepository.save(profile);

    // When
    Optional<Profile> foundProfile = profileRepository.findById(profile.getId());

    // Then
    assertTrue(foundProfile.isPresent(), "Profile was not found - not saved properly");
  }

  @Test
  void shouldDeleteById() {
    // Given
    profileRepository.save(profile);

    // When
    profileRepository.deleteById(profile.getId());
    Optional<Profile> foundProfile = profileRepository.findById(profile.getId());

    // Then
    assertFalse(foundProfile.isPresent(), "Profile was not deleted - not deleted properly");
  }
}