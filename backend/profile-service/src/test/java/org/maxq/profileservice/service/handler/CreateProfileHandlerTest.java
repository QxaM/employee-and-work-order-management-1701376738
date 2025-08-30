package org.maxq.profileservice.service.handler;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.DataValidationException;
import org.maxq.profileservice.domain.exception.DuplicateEmailException;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.handler.CreateProfileHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@SpringBootTest
class CreateProfileHandlerTest {

  @Autowired
  private CreateProfileHandler handler;

  @MockitoBean
  private ProfileService profileService;
  @MockitoBean
  private ProfileMapper profileMapper;

  @Test
  void shouldCreateProfile() throws DataValidationException, DuplicateEmailException {
    // Given
    ProfileDto profileDto = new ProfileDto("test@test.com", "Test", null, "User");
    Profile profile = new Profile(profileDto.getEmail(), profileDto.getFirstName(), profileDto.getLastName());
    when(profileMapper.mapToProfile(profileDto)).thenReturn(profile);

    // When + Then
    assertDoesNotThrow(() -> handler.handleMessage(profileDto));
    verify(profileService, times(1)).createProfile(profile);
  }

  @Test
  void shouldNotThrow_When_CreateProfileThrows() throws DataValidationException,
      DuplicateEmailException {
    // Given
    ProfileDto profileDto = new ProfileDto("test@test.com", "Test", null, "User");
    Profile profile = new Profile(profileDto.getEmail(), profileDto.getFirstName(), profileDto.getLastName());
    when(profileMapper.mapToProfile(profileDto)).thenReturn(profile);
    doThrow(DuplicateEmailException.class).when(profileService).createProfile(profile);

    // When + Then
    assertDoesNotThrow(() -> handler.handleMessage(profileDto));
    verify(profileService, times(1)).createProfile(profile);
  }
}
