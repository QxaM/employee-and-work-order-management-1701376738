package org.maxq.profileservice.service.message.listener;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.service.message.handler.CreateProfileHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class CreateProfileMessageReceiverTest {

  @Autowired
  private CreateProfileMessageReceiver messageReceiver;

  @MockitoBean
  private CreateProfileHandler createProfileHandler;

  @Test
  void shouldReceiveMessage() {
    // Given
    ProfileDto profileDto = new ProfileDto(1L, "test@test.com", "Test", null, "User");

    // When
    messageReceiver.receiveUpdateMessage(profileDto);

    // Then
    verify(createProfileHandler, times(1)).handleMessage(profileDto);
  }

}
