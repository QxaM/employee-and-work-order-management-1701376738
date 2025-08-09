package org.maxq.authorization.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserDetailsDbServiceTest {

  private static final String USERNAME = "test@test.com";

  @Autowired
  private UserDetailsDbService userDetailsDbService;

  @MockitoBean
  private UserService userService;

  @Test
  void shouldLoadUserByUsername() throws ElementNotFoundException {
    // Given
    Role role = new Role(1L, "admin", Collections.emptyList());
    User user = new User(1L, USERNAME, "test", true, Set.of(role));
    when(userService.getUserByEmail(USERNAME)).thenReturn(user);

    // When
    UserDetails userDetails = userDetailsDbService.loadUserByUsername(USERNAME);
    List<String> foundAuthorities = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .map(authority -> authority.replaceAll("ROLE_", ""))
        .toList();

    // Then
    assertAll(
        () -> assertEquals(USERNAME, userDetails.getUsername(),
            "Wrong user found - username should be equal"),
        () -> assertEquals(user.getPassword(), userDetails.getPassword(),
            "Wrong user found - password should be equal"),
        () -> assertEquals(List.of(role.getName()), foundAuthorities,
            "Wrong user found - authorities should be equal")
    );
  }

  @Test
  void shouldThrow_When_UserDoesNotExist() throws ElementNotFoundException {
    // Given
    when(userService.getUserByEmail(USERNAME)).thenThrow(ElementNotFoundException.class);

    // When
    Executable executable = () -> userDetailsDbService.loadUserByUsername(USERNAME);

    // Then
    assertThrows(UsernameNotFoundException.class, executable,
        "Service should throw error when user does not exist");
  }
}