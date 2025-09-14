package org.maxq.profileservice.service.message.listener;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.service.message.handler.ProfileImageUploadHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class ProfileImageUploadMessageReceiverTest {

  @Autowired
  private ProfileImageUploadMessageReceiver messageReceiver;

  @MockitoBean
  private ProfileImageUploadHandler handler;

  @Test
  void shouldReceiveUploadMessage() {
    // Given
    ImageDto imageDto = new ImageDto(
        "test@test.com",
        "test.jpeg",
        "image/jpeg",
        "test-data".getBytes()
    );

    // When
    messageReceiver.receiveUploadMessage(imageDto);

    // Then
    verify(handler, times(1)).handleMessage(imageDto);
  }
}