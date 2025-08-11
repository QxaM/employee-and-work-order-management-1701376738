package org.maxq.profileservice.service;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.stereotype.Service;

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
}

