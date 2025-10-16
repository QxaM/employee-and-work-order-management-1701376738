package org.maxq.profileservice.init;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.Profile;
import org.maxq.profileservice.domain.ProfileImage;
import org.maxq.profileservice.repository.ProfileRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("profileInitializer")
@ConditionalOnProperty(name = "app.init", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class ProfileInitializer {

  private static final ProfileImage ADMIN_IMAGE
      = new ProfileImage("adminProfile.jpg", "image/jpeg", 10_402L);
  private static final Profile ADMIN
      = new Profile(null, "admin@maxq.com", "Admin", null, "MaxQ", ADMIN_IMAGE);
  private static final Profile DESIGNER
      = new Profile("designer@maxq.com", "Designer", "MaxQ");
  private static final Profile OPERATOR
      = new Profile("operator@maxq.com", "Operator", "MaxQ");
  private final ProfileRepository profileRepository;

  @PostConstruct
  public void init() {
    log.info("Initializing profiles");

    List.of(ADMIN, DESIGNER, OPERATOR)
        .forEach(profile -> {
          try {
            profileRepository.save(profile);
            log.info("Profile created: {}", profile);
          } catch (Exception e) {
            log.info("Profile already exists: {}", profile);
          }
        });
  }
}
