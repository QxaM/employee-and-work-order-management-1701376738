package org.maxq.profileservice.controller.api;

import org.maxq.profileservice.domain.dto.ProfileDto;
import org.springframework.http.ResponseEntity;

public interface QaApi {

  ResponseEntity<ProfileDto> createProfile(ProfileDto profileDto);
}
