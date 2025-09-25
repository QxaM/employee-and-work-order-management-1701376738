package org.maxq.profileservice.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.ProfileImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProfileImageRepositoryTest {

  ProfileImage profileImage;
  @Autowired
  private ProfileImageRepository profileImageRepository;

  @BeforeEach
  void setUp() {
    profileImage = new ProfileImage(null, "test.jpg", "image/jpeg", 10, null);
  }

  @AfterEach
  void cleanUp() {
    if (profileImage.getId() != null) {
      profileImageRepository.deleteById(profileImage.getId());
    }
  }

  @Test
  void shouldSave() {
    // Given

    // When
    profileImageRepository.save(profileImage);
    Optional<ProfileImage> optionalFoundProfileImage = profileImageRepository.findById(profileImage.getId());

    // Then
    assertTrue(optionalFoundProfileImage.isPresent(), "Profile Image was not found - not saved properly");

    ProfileImage foundProfileImage = optionalFoundProfileImage.get();
    assertAll(
        () -> assertEquals(profileImage.getId(), foundProfileImage.getId(),
            "Profile Image id does not match"),
        () -> assertEquals(profileImage.getName(), foundProfileImage.getName(),
            "Profile Image name does not match"),
        () -> assertEquals(profileImage.getContentType(), foundProfileImage.getContentType(),
            "Profile Image content type does not match"),
        () -> assertEquals(profileImage.getSize(), foundProfileImage.getSize(),
            "Profile Image size does not match"),
        () -> assertNotNull(foundProfileImage.getTimestamp(), "Profile Image creation timestamp is null")
    );
  }

  @Test
  void shouldDeleteById() {
    // Given
    profileImageRepository.save(profileImage);

    // When
    profileImageRepository.deleteById(profileImage.getId());

    // Then
    Optional<ProfileImage> optionalFoundProfileImage = profileImageRepository.findById(profileImage.getId());
    assertFalse(optionalFoundProfileImage.isPresent(),
        "Profile Image was found - not deleted properly");
  }

}