package org.maxq.profileservice.init;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestPropertySource(properties = {"app.init=true"})
class InitializerTest {

  @Autowired
  private ProfileRepository profileRepository;

  @AfterEach
  void cleanUp() {
    profileRepository.deleteAll();
  }

  @Test
  void shouldCorrectlyInitData() {
    // Given
    String adminEmail = "admin@maxq.com";
    String designerEmail = "designer@maxq.com";
    String operatorEmail = "operator@maxq.com";

    // When
    Optional<Profile> admin = profileRepository.findByEmail(adminEmail);
    Optional<Profile> designer = profileRepository.findByEmail(designerEmail);
    Optional<Profile> operator = profileRepository.findByEmail(operatorEmail);

    // Then
    assertAll(
        () -> assertTrue(admin.isPresent(), "Admin Profile was not created correctly"),
        () -> assertTrue(designer.isPresent(), "Designer Profile was not created correctly"),
        () -> assertTrue(operator.isPresent(), "Operator Profile was not created correctly")
    );
  }
}
