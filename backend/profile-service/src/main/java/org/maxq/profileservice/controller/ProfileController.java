package org.maxq.profileservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.controller.api.ProfileApi;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.dto.UpdateProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.event.message.RabbitmqMessage;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.publisher.MessageService;
import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController implements ProfileApi {

  private final ProfileService profileService;
  private final ProfileMapper profileMapper;
  private final MessageService<RabbitmqMessage<?>> messageService;
  private final ImageValidationService validationService;

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

  @Override
  @PostMapping("/me/image")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<Void> updateProfileImage(Authentication authentication,
                                                 @RequestParam("file") MultipartFile file) throws FileValidationException {
    log.info("Updating profile image for user: {}", authentication.getPrincipal());
    log.info("Received file: {}", file.getOriginalFilename());

    validationService.of(file).validate();
    return ResponseEntity.ok().build();
  }
}
