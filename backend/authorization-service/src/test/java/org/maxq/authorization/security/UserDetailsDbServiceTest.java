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

  private final static String USERNAME = "test@test.com";

  @Autowired
  private UserDetailsDbService userDetailsDbService;

  @MockBean
  private UserService userService;

  @Test
  void shouldLoadUserByUsername() throws ElementNotFoundException {
    // Given
    User user = new User(1L, USERNAME, "test");
    when(userService.getUserByEmail(USERNAME)).thenReturn(user);

    // When
    UserDetails userDetails = userDetailsDbService.loadUserByUsername(USERNAME);

    // Then
    assertEquals(USERNAME, userDetails.getUsername());
    assertEquals(user.getPassword(), userDetails.getPassword());
  }

  @Test
  void shouldThrow_When_UserDoesNotExist() throws ElementNotFoundException {
    // Given
    when(userService.getUserByEmail(USERNAME)).thenThrow(ElementNotFoundException.class);

    // When
    Executable executable = () -> userDetailsDbService.loadUserByUsername(USERNAME);

    // Then
    assertThrows(UsernameNotFoundException.class, executable);
  }
}