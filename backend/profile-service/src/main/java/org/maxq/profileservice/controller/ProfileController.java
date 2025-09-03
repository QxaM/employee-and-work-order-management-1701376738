package org.maxq.profileservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.controller.api.ProfileApi;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.dto.UpdateProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.event.message.RabbitmqMessage;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.publisher.MessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController implements ProfileApi {

  private final ProfileService profileService;
  private final ProfileMapper profileMapper;
  private final MessageService<RabbitmqMessage<?>> messageService;

  @Value("${profile.topic.update}")
  private String updateProfileTopic;

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

  @Override
  @PutMapping("/me")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<Void> updateProfile(Authentication authentication,
                                            @RequestBody @Valid UpdateProfileDto profileDto) {
    ProfileDto profileDtoToSave = new ProfileDto((String) authentication.getPrincipal(),
        profileDto.getFirstName(), profileDto.getMiddleName(), profileDto.getLastName());
    RabbitmqMessage<ProfileDto> message = new RabbitmqMessage<>(profileDtoToSave, updateProfileTopic);

    messageService.sendMessage(message);
    return ResponseEntity.ok().build();
  }
}
