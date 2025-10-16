package org.maxq.profileservice.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.ProfileImage;
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
      = new Profile(1L, "test@test.com", "TestName", "testMiddleName", "TestLastName");
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

  @Test
  void shouldUpdateProfile() throws DataValidationException {
    // Given
    when(profileRepository.findByEmail(profile.getEmail())).thenReturn(Optional.of(profile));
    Profile updateProfile = new Profile(profile.getEmail(), "UpdatedName", "UpdatedMiddleName", "UpdatedLastName");

    // When
    profileService.updateProfile(updateProfile);

    // Then
    verify(profileRepository, times(1))
        .save(argThat(
            profileCall -> profile.getId().equals(profileCall.getId())
                && updateProfile.getEmail().equals(profileCall.getEmail())
                && updateProfile.getFirstName().equals(profileCall.getFirstName())
                && updateProfile.getMiddleName().equals(profileCall.getMiddleName())
                && updateProfile.getLastName().equals(profileCall.getLastName())
        ));
  }

  @Test
  void shouldCreateProfile_When_ProfileDoesNotExistDuring_OnUpdate() throws DataValidationException {
    // Given
    when(profileRepository.findByEmail(profile.getEmail())).thenReturn(Optional.empty());
    Profile updateProfile = new Profile(profile.getEmail(), "UpdatedName", "UpdatedMiddleName", "UpdatedLastName");

    // When
    profileService.updateProfile(updateProfile);

    // Then
    verify(profileRepository, times(1))
        .save(argThat(
            profileCall -> profileCall.getId() == null
                && updateProfile.getEmail().equals(profileCall.getEmail())
                && updateProfile.getFirstName().equals(profileCall.getFirstName())
                && updateProfile.getMiddleName().equals(profileCall.getMiddleName())
                && updateProfile.getLastName().equals(profileCall.getLastName())
        ));
  }

  @Test
  void shouldThrow_When_ProfileValidationFailed_OnUpdate() {
    // Given
    when(profileRepository.findByEmail(profile.getEmail())).thenReturn(Optional.of(profile));
    doThrow(TransactionSystemException.class).when(profileRepository).save(any(Profile.class));

    // When + Then
    assertThrows(DataValidationException.class,
        () -> profileService.updateProfile(profile)
    );
  }

  @Test
  void shouldUpdateProfileImage() {
    // Given
    ProfileImage profileImage = new ProfileImage("file.jpeg", "image/jpeg", 10);
    Profile profileWithImage = new Profile(
        profile.getId(), profile.getEmail(),
        profile.getFirstName(), profile.getMiddleName(), profile.getLastName()
    );

    // When
    profileService.updateProfileImage(profileWithImage, profileImage);

    // Then
    verify(profileRepository, times(1))
        .save(
            argThat(argument -> profileImage.getName().equals(argument.getProfileImage().getName())
                && profileImage.getContentType().equals(argument.getProfileImage().getContentType())
                && profileImage.getSize() == argument.getProfileImage().getSize())
        );
  }

  @Test
  void shouldReturnProfileImage() throws ElementNotFoundException {
    // Given
    String email = "test@test.com";
    ProfileImage profileImage = new ProfileImage("test.jpeg", "image/jpeg", 10);
    Profile profileWithImage = new Profile(1L, email, "Test", null, "User", profileImage);

    ProfileService spyService = spy(profileService);
    doReturn(profileWithImage).when(spyService).getProfileByEmail(anyString());

    // When
    ProfileImage returnedProfileImage = spyService.getProfileImage(email);

    // Then
    assertAll(
        () -> assertEquals(profileImage.getName(), returnedProfileImage.getName(),
            "Should return image with correct name"),
        () -> assertEquals(profileImage.getContentType(), returnedProfileImage.getContentType(),
            "Should return correct image content type"),
        () -> assertEquals(profileImage.getSize(), returnedProfileImage.getSize(),
            "Should return correct image size")
    );
  }

  @Test
  void shouldThrow_When_ReturnProfileImage_When_ProfileNotFound() throws ElementNotFoundException {
    // Given
    String email = "test@test.com";

    ProfileService spyService = spy(profileService);
    doThrow(ElementNotFoundException.class).when(spyService).getProfileByEmail(anyString());

    // When
    Executable executable = () -> spyService.getProfileImage(email);

    // Then
    assertThrows(ElementNotFoundException.class, executable,
        "Should throw exception when profile not found");
  }

  @Test
  void shouldThrow_When_ReturnProfileImage_When_ProfileImageNull() throws ElementNotFoundException {
    // Given
    String email = "test@test.com";

    ProfileService spyService = spy(profileService);
    doReturn(profile).when(spyService).getProfileByEmail(anyString());

    // When
    Executable executable = () -> spyService.getProfileImage(email);

    // Then
    assertThrows(ElementNotFoundException.class, executable,
        "Should throw exception when profile image not found");
  }
}