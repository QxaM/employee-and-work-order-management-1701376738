package org.maxq.authorization.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserDetailsDbServiceTest {

  private static final String USERNAME = "test@test.com";

  @Autowired
  private UserDetailsDbService userDetailsDbService;

  @MockBean
  private UserService userService;

  @Test
  void shouldLoadUserByUsername() throws ElementNotFoundException {
    // Given
    User user = new User(USERNAME, "test");
    when(userService.getUserByEmail(USERNAME)).thenReturn(user);

    // When
    UserDetails userDetails = userDetailsDbService.loadUserByUsername(USERNAME);

    // Then
    assertEquals(USERNAME, userDetails.getUsername(),
        "Wrong user found - username should be equal");
    assertEquals(user.getPassword(), userDetails.getPassword(),
        "Wrong user found - password should be equal");
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