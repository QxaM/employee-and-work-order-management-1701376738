package org.maxq.profileservice.service.message.handler;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.DataValidationException;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@SpringBootTest
class UpdateProfileHandlerTest {

  @Autowired
  private UpdateProfileHandler handler;

  @MockitoBean
  private ProfileService profileService;
  @MockitoBean
  private ProfileMapper profileMapper;

  @Test
  void shouldHandleMessage() throws DataValidationException {
    // Given
    ProfileDto profileDto
        = new ProfileDto(null, "test@test.com", "UpdateName", "UpdateMiddleName", "UpdateLastName");
    Profile profile = new Profile(
        profileDto.getId(),
        profileDto.getEmail(), profileDto.getFirstName(),
        profileDto.getMiddleName(), profileDto.getLastName()
    );
    when(profileMapper.mapToProfile(profileDto)).thenReturn(profile);

    // When
    handler.handleMessage(profileDto);

    // Then
    verify(profileService, times(1))
        .updateProfile(argThat(profileCall ->
            profileCall.getId() == null
                && profile.getEmail().equals(profileCall.getEmail())
                && profile.getFirstName().equals(profileCall.getFirstName())
                && profile.getMiddleName().equals(profileCall.getMiddleName())
                && profile.getLastName().equals(profileCall.getLastName())
        ));
  }

  @Test
  void shouldNotThrow_When_UpdateThrows() throws DataValidationException {
    // Given
    ProfileDto profileDto
        = new ProfileDto(null, "test@test.com", "UpdateName", "UpdateMiddleName", "UpdateLastName");
    Profile profile = new Profile(
        profileDto.getId(),
        profileDto.getEmail(), profileDto.getFirstName(),
        profileDto.getMiddleName(), profileDto.getLastName()
    );
    when(profileMapper.mapToProfile(profileDto)).thenReturn(profile);
    doThrow(DataValidationException.class).when(profileService).updateProfile(any(Profile.class));

    // When + Then
    assertDoesNotThrow(() -> handler.handleMessage(profileDto));
  }
}