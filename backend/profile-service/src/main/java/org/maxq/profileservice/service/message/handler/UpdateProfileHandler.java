package org.maxq.profileservice.service.message.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.DataValidationException;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UpdateProfileHandler implements MessageHandler<ProfileDto> {

  private final ProfileService profileService;
  private final ProfileMapper profileMapper;

  @Override
  public void handleMessage(ProfileDto message) {
    log.info("Handling message with profile: {}", message);
    Profile profile = profileMapper.mapToProfile(message);
    try {
      profileService.updateProfile(profile);
      log.info("Profile update handled: {}", profile);
    } catch (DataValidationException e) {
      log.error("Failed to handle profile profile: {}", profile, e);
    }
  }
}
