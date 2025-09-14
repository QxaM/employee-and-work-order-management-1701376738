package org.maxq.profileservice.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.ValidationError;
import org.maxq.profileservice.domain.ValidationResult;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.event.message.RabbitmqMessage;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.maxq.profileservice.service.message.publisher.MessageService;
import org.maxq.profileservice.service.validation.ValidationServiceFactory;
import org.maxq.profileservice.service.validation.file.ImageContentValidationService;
import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;

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
  private ProfileMapper profileMapper;
  @MockitoBean
  private MessageService<RabbitmqMessage<?>> messageService;
  @MockitoBean
  private ValidationServiceFactory validationFactory;

  @MockitoBean
  private JwtDecoder jwtDecoder;

  @Mock
  private ImageValidationService validationService;
  @Mock
  private ImageContentValidationService contentValidationService;

  @BeforeEach
  void setup() throws IOException {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
        .apply(SecurityMockMvcConfigurers.springSecurity())
        .build();

    when(jwtDecoder.decode("test-token")).thenReturn(jwt);

    when(validationFactory.createImageValidationService(any(MultipartFile.class)))
        .thenReturn(validationService);
    when(validationFactory.createImageContentValidationService(any(InMemoryFile.class)))
        .thenReturn(contentValidationService);

    when(validationService.validateName()).thenReturn(validationService);
    when(validationService.validateExtension()).thenReturn(validationService);
    when(validationService.validateContentType()).thenReturn(validationService);
    when(validationService.validateSize()).thenReturn(validationService);

    when(contentValidationService.validateSignature()).thenReturn(contentValidationService);
    when(contentValidationService.validateRealContent()).thenReturn(contentValidationService);
    when(contentValidationService.validateMetadata()).thenReturn(contentValidationService);
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
            {
              try {
                return Arrays.equals(
                    mockMultipartFile.getBytes(),
                    ((ImageDto) message.getPayload()).getData()
                );
              } catch (IOException e) {
                throw new RuntimeException(e);
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
  void shouldReturn400_When_InvalidImageNameProvided() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_NAME;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);


    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(validationService, times(1)).validateName();
  }

  @Test
  void shouldReturn400_When_InvalidImageExtensionProvided() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_EXTENSION;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);


    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(validationService, times(1)).validateExtension();
  }

  @Test
  void shouldReturn400_When_InvalidImageContentTypeProvided() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_CONTENT_TYPE;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);


    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(validationService, times(1)).validateContentType();
  }

  @Test
  void shouldReturn400_When_InvalidImageSize() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_SIZE;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);


    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(validationService, times(1)).validateSize();
  }

  @Test
  void shouldReturn400_When_MultipleImageValidationErrors() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError errorName = ValidationError.FILE_NAME;
    ValidationError errorExtension = ValidationError.FILE_EXTENSION;
    ValidationError errorContentType = ValidationError.FILE_CONTENT_TYPE;
    ValidationError errorSize = ValidationError.FILE_SIZE;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(errorName);
    validationResult.addError(errorExtension);
    validationResult.addError(errorContentType);
    validationResult.addError(errorSize);

    doThrow(new FileValidationException(testError, validationResult)).when(validationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andDo(MockMvcResultHandlers.print())
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath(
                "$.errors",
                Matchers.containsInAnyOrder(
                    errorName.getMessage(),
                    errorExtension.getMessage(),
                    errorContentType.getMessage(),
                    errorSize.getMessage()
                )
            ));
    verify(validationService, times(1)).validateName();
    verify(validationService, times(1)).validateExtension();
    verify(validationService, times(1)).validateContentType();
    verify(validationService, times(1)).validateSize();
  }

  @Test
  void shouldReturn400_When_InvalidImageSignature() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_REAL_FORMAT;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);


    doThrow(new FileValidationException(testError, validationResult)).when(contentValidationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(contentValidationService, times(1)).validateSignature();
  }

  @Test
  void shouldReturn400_When_ImageContentEmpty() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_CONTENT_TYPE;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);


    doThrow(new FileValidationException(testError, validationResult)).when(contentValidationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(contentValidationService, times(1)).validateSignature();
  }

  @Test
  void shouldReturn400_When_ImageContentMismatch() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_CONTENT_MISMATCH;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);

    doThrow(new FileValidationException(testError, validationResult)).when(contentValidationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(contentValidationService, times(1)).validateSignature();
  }

  @Test
  void shouldReturn400_When_RealContentInvalid() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.FILE_REAL_FORMAT;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);

    doThrow(new FileValidationException(testError, validationResult)).when(contentValidationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(contentValidationService, times(1)).validateRealContent();
  }

  @Test
  void shouldReturn400_When_ImageDimensionInvalid() throws Exception {
    // Given
    String testError = "Test error";
    ValidationError error = ValidationError.IMAGE_SIZE;
    ValidationResult validationResult = new ValidationResult();
    validationResult.addError(error);

    doThrow(new FileValidationException(testError, validationResult)).when(contentValidationService).validate();

    // When + Then
    mockMvc.perform(MockMvcRequestBuilders
            .multipart(URL + "/me/image")
            .file(mockMultipartFile)
            .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
            .header("X-User", EMAIL)
            .header("X-User-Roles", ROLES))
        .andExpect(MockMvcResultMatchers.status().isBadRequest())
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.message", Matchers.is(testError)))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.hasSize(validationResult.getMessages().size())))
        .andExpect(MockMvcResultMatchers
            .jsonPath("$.errors", Matchers.containsInAnyOrder(error.getMessage())));
    verify(contentValidationService, times(1)).validateMetadata();
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
}