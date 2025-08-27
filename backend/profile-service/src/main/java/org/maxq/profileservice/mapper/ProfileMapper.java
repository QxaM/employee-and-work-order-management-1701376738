package org.maxq.profileservice.mapper;

import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.springframework.stereotype.Service;

@Service
public class ProfileMapper {

  public ProfileDto mapToProfileDto(Profile profile) {
    return new ProfileDto(
        profile.getEmail(),
        profile.getFirstName(),
        profile.getMiddleName(),
        profile.getLastName()
    );
  }
}
