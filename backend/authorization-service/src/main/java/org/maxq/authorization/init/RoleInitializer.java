package org.maxq.authorization.init;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.repository.RoleRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("roleInitializer")
@ConditionalOnProperty(name = "app.init", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class RoleInitializer {

  private static final String ROLE_ADMIN = "ADMIN";
  private static final String ROLE_OPERATOR = "OPERATOR";
  private static final String ROLE_DESIGNER = "DESIGNER";

  private final RoleRepository roleRepository;

  @PostConstruct
  public void init() {
    log.info("Initializing roles");

    List.of(ROLE_ADMIN, ROLE_OPERATOR, ROLE_DESIGNER)
        .forEach(role -> {
          try {
            roleRepository.save(new Role(role));
            log.info("Role created: {}", role);
          } catch (Exception e) {
            log.info("Role already exists: {}", role);
          }
        });
  }
}
