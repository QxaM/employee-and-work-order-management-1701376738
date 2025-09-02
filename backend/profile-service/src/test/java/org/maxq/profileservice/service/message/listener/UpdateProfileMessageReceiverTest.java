package org.maxq.profileservice.service.message.listener;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.service.message.handler.UpdateProfileHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class UpdateProfileMessageReceiverTest {

  @Autowired
  private UpdateProfileMessageReceiver messageReceiver;

  @MockitoBean
  private UpdateProfileHandler updateProfileHandler;

  @Test
  void shouldReceiveCreateMessage() {
    // Give
    ProfileDto profileDto
        = new ProfileDto(null, "test@test.com", "UpdateName", "UpdateMiddleName", "UpdateLastName");

    // When
    messageReceiver.receiveCreateMessage(profileDto);

    // Then
    verify(updateProfileHandler, times(1))
        .handleMessage(argThat(profile ->
            profileDto.getEmail().equals(profile.getEmail())
                && profileDto.getFirstName().equals(profile.getFirstName())
                && profileDto.getMiddleName().equals(profile.getMiddleName())
                && profileDto.getLastName().equals(profile.getLastName())
        ));
  }
}