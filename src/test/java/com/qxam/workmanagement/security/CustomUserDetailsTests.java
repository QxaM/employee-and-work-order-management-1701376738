package com.qxam.workmanagement.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.exception.ElementNotFound;
import com.qxam.workmanagement.service.UserDbService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@SpringBootTest
class CustomUserDetailsTests {

  private static final String EMAIL = "test@test.com";

  @Autowired private CustomUserDetails customUserDetails;

  @MockBean private UserDbService service;

  @Test
  void shouldFindUser() throws ElementNotFound {
    // Given
    User foundUser = User.builder().email(EMAIL).password("12345").build();
    when(service.findUserByEmail(EMAIL)).thenReturn(foundUser);

    // When
    UserDetails foundUserDetails = customUserDetails.loadUserByUsername(EMAIL);

    // Then
    assertAll(
        () -> assertEquals(foundUser.getEmail(), foundUserDetails.getUsername()),
        () -> assertEquals(foundUser.getPassword(), foundUserDetails.getPassword()),
        () -> assertTrue(foundUserDetails.getAuthorities().isEmpty()));
  }

  @Test
  void shouldThrowNotFound() throws ElementNotFound {
    // Given
    doThrow(ElementNotFound.class).when(service).findUserByEmail(EMAIL);

    // When + Then
    assertThrows(
        UsernameNotFoundException.class, () -> customUserDetails.loadUserByUsername(EMAIL));
  }
}
