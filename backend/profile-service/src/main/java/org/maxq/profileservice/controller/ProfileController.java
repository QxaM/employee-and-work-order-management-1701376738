package org.maxq.profileservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.controller.api.ProfileApi;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController implements ProfileApi {

  private final ProfileService profileService;
  private final ProfileMapper profileMapper;

  @Override
  @GetMapping("/me")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<ProfileDto> getMyProfile(Authentication authentication) throws ElementNotFoundException {
    String email = (String) authentication.getPrincipal();
    Profile foundProfile = profileService.getProfileByEmail(email);
    return ResponseEntity.ok(
        profileMapper.mapToProfileDto(foundProfile)
    );
  }
}
