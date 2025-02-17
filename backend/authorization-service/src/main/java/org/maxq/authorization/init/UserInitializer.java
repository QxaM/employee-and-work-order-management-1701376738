package org.maxq.authorization.init;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.service.RoleService;
import org.maxq.authorization.service.UserService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@DependsOn("roleInitializer")
@ConditionalOnProperty(name = "app.init", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class UserInitializer {
  private static final String ADMIN_EMAIL = "admin@maxq.com";
  private static final String ADMIN_PASSWORD = "Admin12345";
  private static final String OPERATOR_EMAIL = "operator@maxq.com";
  private static final String OPERATOR_PASSWORD = "Operator12345";
  private static final String DESIGNER_EMAIL = "designer@maxq.com";
  private static final String DESIGNER_PASSWORD = "Designer12345";

  private final UserService userService;
  private final RoleService roleService;
  private final PasswordEncoder passwordEncoder;

  @PostConstruct
  public void init() throws ElementNotFoundException {
    log.info("Initializing users");


    Role roleAdmin = roleService.findByName("ADMIN");
    @SuppressWarnings("java:S6437")
    User admin = new User(ADMIN_EMAIL, passwordEncoder.encode(ADMIN_PASSWORD), true);
    admin.getRoles().add(roleAdmin);

    Role roleOperator = roleService.findByName("OPERATOR");
    @SuppressWarnings("java:S6437")
    User operator = new User(OPERATOR_EMAIL, passwordEncoder.encode(OPERATOR_PASSWORD), true);
    operator.getRoles().add(roleOperator);

    Role roleDesigner = roleService.findByName("DESIGNER");
    @SuppressWarnings("java:S6437")
    User designer = new User(DESIGNER_EMAIL, passwordEncoder.encode(DESIGNER_PASSWORD), true);
    designer.getRoles().add(roleDesigner);

    List.of(admin, operator, designer).forEach(user -> {
      try {
        userService.createUser(user);
        log.info("Default user created - {}", user.getEmail());
      } catch (Exception e) {
        log.info("Default {} user already exists", user.getEmail());
      }
    });
  }
}
