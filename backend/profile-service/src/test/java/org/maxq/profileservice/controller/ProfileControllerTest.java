package org.maxq.profileservice.controller;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.dto.ProfileDto;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.mapper.ProfileMapper;
import org.maxq.profileservice.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
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
import static org.mockito.Mockito.when;

@SpringBootTest
@WebAppConfiguration
class ProfileControllerTest {

  private static final String URL = "/profiles";
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
      = new Profile(email, "TestName", "testMiddleName", "TestLastName");
  ProfileDto profileDto
      = new ProfileDto(email, profile.getFirstName(), profile.getMiddleName(), profile.getLastName());

  private MockMvc mockMvc;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @MockitoBean
  private ProfileService profileService;
  @MockitoBean
  private ProfileMapper profileMapper;

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

}