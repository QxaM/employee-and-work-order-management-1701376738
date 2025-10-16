package org.maxq.profileservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.controller.api.QaApi;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.service.message.listener.CreateProfileMessageReceiver;
import org.maxq.profileservice.service.message.listener.UpdateProfileMessageReceiver;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qa")
@Profile({"QA", "DEV", "SIT"})
@RequiredArgsConstructor
public class QaController implements QaApi {

  private final CreateProfileMessageReceiver createProfileMessageReceiver;
  private final UpdateProfileMessageReceiver updateProfileMessageReceiver;

  @Override
  @PostMapping("/profiles")
  public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto) {
    createProfileMessageReceiver.receiveUpdateMessage(profileDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(profileDto);
  }

  @Override
  @PutMapping("/profiles")
  public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profileDto) {
    updateProfileMessageReceiver.receiveCreateMessage(profileDto);
    return ResponseEntity.ok().body(profileDto);
  }
}
