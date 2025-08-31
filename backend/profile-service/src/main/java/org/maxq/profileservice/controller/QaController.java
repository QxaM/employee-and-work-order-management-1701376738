package org.maxq.profileservice.controller;

import lombok.RequiredArgsConstructor;
import org.maxq.profileservice.controller.api.QaApi;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.service.message.listener.CreateProfileMessageReceiver;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/qa")
@Profile({"QA", "DEV", "SIT"})
@RequiredArgsConstructor
public class QaController implements QaApi {

  private final CreateProfileMessageReceiver createProfileMessageReceiver;

  @Override
  @PostMapping("/profiles/create")
  public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto) {
    createProfileMessageReceiver.receiveCreateMessage(profileDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(profileDto);
  }
}
