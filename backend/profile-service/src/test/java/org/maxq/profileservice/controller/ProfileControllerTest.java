package org.maxq.profileservice.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.*;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.event.message.RabbitmqMessage;
import org.maxq.profileservice.mapper.InMemoryFileMapper;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileImageService;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.publisher.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
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

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@WebAppConfiguration
class ProfileControllerTest {

  private static final String URL = "/profiles";
  private static final Gson GSON = new Gson();
  private static final String EMAIL = "test@test.com";
  private static final String ROLES = "ROLE_TEST";

  private final Jwt jwt = Jwt.withTokenValue("test-token")
      .header("alg", "RS256")
      .subject("robot")
      .issuer("api-gateway-service")
      .claim("type", "access_token")
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();
  private final Profile profile
      = new Profile(1L, EMAIL, "TestName", "testMiddleName", "TestLastName");
  private final ProfileDto profileDto
      = new ProfileDto(1L, EMAIL, profile.getFirstName(), profile.getMiddleName(), profile.getLastName());
  private final MockMultipartFile mockMultipartFile
      = new MockMultipartFile("file", "image.jpeg", "image/jpeg", "test-content".getBytes());

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockitoBean
  private ProfileService profileService;
  @MockitoBean
  private ProfileImageService profileImageService;
  @MockitoBean
  private ProfileMapper profileMapper;
  @MockitoBean
  private InMemoryFileMapper fileMapper;
  @MockitoBean
  private MessageService<RabbitmqMessage<?>> messageService;

  @MockitoBean
  private JwtDecoder jwtDecoder;

  @BeforeEach
  void setup() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(SecurityMockMvcConfigurers.springSecurity())
        .build();

    when(jwtDecoder.decode("test-token")).thenReturn(jwt);
  }

  @Test
  void shouldReturnProfile_When_Authenticated() throws Exception {
    // Given
    when(profileService.getProfileByEmail(EMAIL)).thenReturn(profile);
    when(profileMapper.mapToProfileDto(any(Profile.class))).thenReturn(profileDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
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
    when(profileService.getProfileByEmail(EMAIL)).thenReturn(profile);
    when(profileMapper.mapToProfileDto(any(Profile.class))).thenReturn(profileDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldReturn403_When_NoUserHeaders() throws Exception {
    // Given
    when(profileService.getProfileByEmail(EMAIL)).thenReturn(profile);
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
    when(profileService.getProfileByEmail(EMAIL)).
        thenThrow(new ElementNotFoundException(error));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(error)));
  }

  @Test
  void shouldUpdateProfile() throws Exception {
    // Given
    when(profileService.getProfileByEmail(EMAIL)).thenReturn(profile);
    ProfileDto updatedProfile = new ProfileDto(
        profileDto.getId(), profileDto.getEmail(),
        "UpdatedName", null, "UpdatedLastName");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL + "/me")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(updatedProfile))
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(messageService, times(1))
        .sendMessage(argThat(message -> "profile.update".equals(message.getTopic())));
    verify(messageService, times(1))
        .sendMessage(argThat(message -> EMAIL.equals(((ProfileDto) message.getPayload()).getEmail())));
  }

  @Test
  void shouldThrow401_When_NoRobotToken_OnUpdate() throws Exception {
    // Given
    when(profileService.getProfileByEmail(EMAIL)).thenReturn(profile);
    ProfileDto updatedProfile = new ProfileDto(
        profileDto.getId(), profileDto.getEmail(),
        "UpdatedName", null, "UpdatedLastName");

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .put(URL + "/me")
            .contentType(MediaType.APPLICATION_JSON)
            .content(GSON.toJson(updatedProfile))
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldThrow403_When_NoUserHeaders_OnUpdate() throws Exception {
    // Given
    when(profileService.getProfileByEmail(EMAIL)).thenReturn(profile);
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

  @Test
  void shouldReturn200_When_CorrectImageUploaded() throws Exception {
    // Given
    InMemoryFile newFile = InMemoryFile.create(mockMultipartFile.getBytes(), mockMultipartFile.getContentType());
    ImageDto imageDto = new ImageDto(
        EMAIL,
        newFile.getName(),
        newFile.getContentType(),
        newFile.getData()
    );

    when(profileImageService.validateAndReturnImage(mockMultipartFile)).thenReturn(newFile);
    when(fileMapper.mapToImageDto(newFile, EMAIL)).thenReturn(imageDto);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk());
    verify(messageService, times(1))
        .sendMessage(argThat(message -> "profile.image.upload".equals(message.getTopic())));
    verify(messageService, times(1))
        .sendMessage(argThat(message ->
            EMAIL.equals(((ImageDto) message.getPayload()).getUserEmail())
        ));
    verify(messageService, times(1))
        .sendMessage(argThat(message ->
            {
              try {
                return Arrays.equals(
                    mockMultipartFile.getBytes(),
                    ((ImageDto) message.getPayload()).getData()
                );
              } catch (IOException e) {
                return false;
              }
            }
        ));
    verify(messageService, times(1))
        .sendMessage(argThat(message ->
            !mockMultipartFile.getOriginalFilename().equals(((ImageDto) message.getPayload()).getName())
        ));
  }

  @Test
  void shouldReturn400_When_NoImageProvided() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Required part 'file' is not present.")));
  }


  @Test
  void shouldReturn401_When_NoRobotToken_ImageUpload() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldReturn403_When_NoUserHeaders_ImageUpload() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Forbidden: You don't have permission to access this resource")));
  }

  @Test
  void shouldReturn404_When_ValidationFailed_ImageUpload() throws Exception {
    // Given
    ValidationError fileNameError = ValidationError.FILE_NAME;
    ValidationError extensionError = ValidationError.FILE_EXTENSION;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(fileNameError);
    validationResult.addError(extensionError);
    FileValidationException exception = new FileValidationException("Test error", validationResult);

    doThrow(exception).when(profileImageService).validateAndReturnImage(mockMultipartFile);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers.jsonPath("$.errors", Matchers.hasSize(2)))
        .andExpect(MockMvcResultMatchers.jsonPath("$.errors",
            Matchers.containsInAnyOrder(fileNameError.getMessage(), extensionError.getMessage())));
  }

  @Test
  void shouldReturn200_When_CorrectImageReturned() throws Exception {
    // Given
    ProfileImage profileImage = new ProfileImage("test.jpeg", "image/jpeg", mockMultipartFile.getSize());
    Resource resource = new ByteArrayResource(mockMultipartFile.getBytes());

    when(profileService.getProfileImage(EMAIL)).thenReturn(profileImage);
    when(profileImageService.getProfileImageFromStorage(profileImage)).thenReturn(resource);

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me/image")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.content().contentType(MediaType.IMAGE_JPEG))
        .andExpect(MockMvcResultMatchers.content().bytes(mockMultipartFile.getBytes()));
  }

  @Test
  void shouldReturn401_When_NoRobotToken_GetImage() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me/image")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Unauthorized to access this resource, login please")));
  }

  @Test
  void shouldReturn403_When_NoUserHeaders_GetImage() throws Exception {
    // Given

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me/image")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token"))
        .andExpect(MockMvcResultMatchers.status().isForbidden())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is("Forbidden: You don't have permission to access this resource")));
  }

  @Test
  void shouldReturn404_When_UserOrImageNotFound_GetImage() throws Exception {
    // Given
    String error = "Test error";
    when(profileService.getProfileImage(EMAIL)).thenThrow(
        new ElementNotFoundException(error)
    );

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me/image")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(error)));
  }

  @Test
  void shouldReturn404_When_BucketOperationFailed_GetImage() throws Exception {
    // Given
    String error = "Test error";
    ProfileImage profileImage = new ProfileImage("test.jpeg", "image/jpeg", mockMultipartFile.getSize());

    when(profileService.getProfileImage(EMAIL)).thenReturn(profileImage);
    when(profileImageService.getProfileImageFromStorage(profileImage)).thenThrow(new BucketOperationException(error));

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .get(URL + "/me/image")
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isInternalServerError())
        .andExpect(MockMvcResultMatchers.jsonPath("$.message", Matchers.is(error)));
  }
}