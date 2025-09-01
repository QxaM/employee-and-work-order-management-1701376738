package org.maxq.profileservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.exception.DataValidationException;
import org.maxq.profileservice.domain.exception.DuplicateEmailException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

  private final ProfileRepository profileRepository;

  public Profile getProfileByEmail(String email) throws ElementNotFoundException {
    return profileRepository.findByEmail(email)
        .orElseThrow(() ->
            new ElementNotFoundException("User with email: " + email + " does not exist!")
        );
  }

  public void createProfile(Profile profile) throws DuplicateEmailException, DataValidationException {
    try {
      profileRepository.save(profile);
    } catch (TransactionSystemException e) {
      throw new DataValidationException("Failed email or password validation", e);
    } catch (DataIntegrityViolationException e) {
      throw new DuplicateEmailException(
          "User with this email already exists! Email: " + profile.getEmail(), e);
    }
  }

  public void updateProfile(Profile profile) throws DataValidationException {
    Profile profileToSave;
    try {
      Profile foundProfile = this.getProfileByEmail(profile.getEmail());
      profileToSave = new Profile(foundProfile.getId(), profile.getEmail(), profile.getFirstName(), profile.getMiddleName(), profile.getLastName());
    } catch (ElementNotFoundException e) {
      log.warn("Profile not found when updating, creating new profile: {}", profile.getEmail(), e);
      profileToSave = new Profile(profile.getEmail(), profile.getFirstName(), profile.getMiddleName(), profile.getLastName());
    }

    try {
      profileRepository.save(profileToSave);
    } catch (TransactionSystemException e) {
      throw new DataValidationException("Failed email or password validation", e);
    }
  }

}

