package org.maxq.profileservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.controller.api.ProfileApi;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.ProfileImage;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.dto.UpdateProfileDto;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileImageService;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.RabbitmqMessage;
import org.maxq.profileservice.service.message.publisher.MessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController implements ProfileApi {

  private final ProfileService profileService;
  private final ProfileImageService profileImageService;
  private final ProfileMapper profileMapper;
  private final InMemoryFileMapper inMemoryFileMapper;
  private final MessageService<RabbitmqMessage<?>> messageService;

  @Value("${profile.topic.update}")
  private String updateProfileTopic;

  @Value("${profile.topic.image.upload}")
  private String imageUploadTopic;

  @Override
  @GetMapping("/me")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<ProfileDto> getMyProfile(Authentication authentication)
      throws ElementNotFoundException {
    String email = (String) authentication.getPrincipal();
    Profile foundProfile = profileService.getProfileByEmail(email);
    return ResponseEntity.ok(
        profileMapper.mapToProfileDto(foundProfile)
    );
  }

  @Override
  @PutMapping("/me")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<Void> updateProfile(
      Authentication authentication,
      @RequestBody @Valid UpdateProfileDto profileDto) {
    ProfileDto profileDtoToSave = new ProfileDto((String) authentication.getPrincipal(),
        profileDto.getFirstName(), profileDto.getMiddleName(), profileDto.getLastName());
    RabbitmqMessage<ProfileDto> message = new RabbitmqMessage<>(profileDtoToSave,
        updateProfileTopic);
    messageService.sendMessage(message);
    return ResponseEntity.ok().build();
  }

  @Override
  @PostMapping("/me/image")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<Void> updateProfileImage(
      Authentication authentication,
      @RequestParam("file") MultipartFile file) throws FileValidationException, IOException {
    log.info("Updating profile image for user: {}", authentication.getPrincipal());
    InMemoryFile newFile = profileImageService.validateAndReturnImage(file);
    ImageDto image = inMemoryFileMapper.mapToImageDto(newFile,
        authentication.getPrincipal().toString());

    RabbitmqMessage<ImageDto> message = new RabbitmqMessage<>(image, imageUploadTopic);
    messageService.sendMessage(message);
    return ResponseEntity.ok().build();
  }

  @Override
  @GetMapping("/me/image")
  @PreAuthorize("authentication.principal != null")
  public ResponseEntity<Resource> getMyProfileImage(Authentication authentication)
      throws ElementNotFoundException, BucketOperationException, IOException {
    String email = (String) authentication.getPrincipal();
    ProfileImage profileImage = profileService.getProfileImage(email);

    Resource imageResource = profileImageService.getProfileImageFromStorage(profileImage);
    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_JPEG)
        .contentLength(imageResource.contentLength())
        .body(imageResource);
  }
}
