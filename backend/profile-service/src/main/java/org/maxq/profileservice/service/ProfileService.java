package org.maxq.profileservice.service;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.exception.DataValidationException;
import org.maxq.profileservice.domain.exception.DuplicateEmailException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

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

}

