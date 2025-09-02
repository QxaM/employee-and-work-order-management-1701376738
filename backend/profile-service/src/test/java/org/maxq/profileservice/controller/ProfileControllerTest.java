package org.maxq.profileservice.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.event.message.RabbitmqMessage;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.publisher.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@WebAppConfiguration
class ProfileControllerTest {

  private static final String URL = "/profiles";
  private static final Gson GSON = new Gson();

  Jwt jwt = Jwt.withTokenValue("test-token")
      .header("alg", "RS256")
      .subject("robot")
      .issuer("api-gateway-service")
      .claim("type", "access_token")
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();
  String email = "test@test.com";
  String roles = "ROLE_TEST";
  Profile profile
      = new Profile(1L, email, "TestName", "testMiddleName", "TestLastName");
  ProfileDto profileDto
      = new ProfileDto(1L, email, profile.getFirstName(), profile.getMiddleName(), profile.getLastName());
  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockitoBean
  private ProfileService profileService;
  @MockitoBean
  private ProfileMapper profileMapper;
  @MockitoBean
  private MessageService<RabbitmqMessage<?>> messageService;

  @MockitoBean
  private JwtDecoder jwtDecoder;

  @BeforeEach
  void securitySetup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(SecurityMockMvcConfigurers.springSecurity())
        .build();

    when(jwtDecoder.decode("test-token")).thenReturn(jwt);
  }

  @Test
  void shouldReturnProfile_When_Authenticated() throws Exception {
    // Given
    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    when(profileMapper.mapToProfileDto(any(Profile.class))).thenReturn(profileDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", email)
            .header("X-User-Roles", roles))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.email", Matchers.is(profileDto.getEmail())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.firstName", Matchers.is(profileDto.getFirstName())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.middleName", Matchers.is(profileDto.getMiddleName())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.lastName", Matchers.is(profileDto.getLastName())));
  }

  @Test
  void shouldReturn401_When_NoRobotToken() throws Exception {
    // Given
    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    when(profileMapper.mapToProfileDto(any(Profile.class))).thenReturn(profileDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header("X-User", email)
            .header("X-User-Roles", roles))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldReturn403_When_NoUserHeaders() throws Exception {
    // Given
    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    when(profileMapper.mapToProfileDto(any(Profile.class))).thenReturn(profileDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers
            .jsonPath(
                "$.message",
                Matchers.is("Forbidden: You don't have permission to access this resource")
            ));
  }

  @Test
  void shouldReturn404_When_ProfileDoesNotExist() throws Exception {
    // Given
    String error = "Test error";
    when(profileService.getProfileByEmail(email)).
        thenThrow(new ElementNotFoundException(error));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", email)
            .header("X-User-Roles", roles))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(error)));
  }

  @Test
  void shouldUpdateProfile() throws Exception {
    // Given
    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    ProfileDto updatedProfile = new ProfileDto(
        profileDto.getId(), profileDto.getEmail(),
        "UpdatedName", null, "UpdatedLastName");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL + "/me")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(updatedProfile))
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", email)
            .header("X-User-Roles", roles))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(messageService, times(1))
        .sendMessage(argThat(message -> "profile.update".equals(message.getTopic())));
    verify(messageService, times(1))
        .sendMessage(argThat(message -> email.equals(((ProfileDto) message.getPayload()).getEmail())));
  }

  @Test
  void shouldThrow401_When_NoRobotToken_OnUpdate() throws Exception {
    // Given
    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    ProfileDto updatedProfile = new ProfileDto(
        profileDto.getId(), profileDto.getEmail(),
        "UpdatedName", null, "UpdatedLastName");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL + "/me")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(updatedProfile))
            .header("X-User", email)
            .header("X-User-Roles", roles))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldThrow403_When_NoUserHeaders_OnUpdate() throws Exception {
    // Given
    when(profileService.getProfileByEmail(email)).thenReturn(profile);
    ProfileDto updatedProfile = new ProfileDto(
        profileDto.getId(), profileDto.getEmail(),
        "UpdatedName", null, "UpdatedLastName");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL + "/me")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(updatedProfile))
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Forbidden: You don't have permission to access this resource")));
  }
}