package org.maxq.authorization.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsDbService implements UserDetailsService {

  private final UserService userService;

  @Override
  public UserDetails loadUserByUsername(String username) {
    User foundUser;
    try {
      foundUser = userService.getUserByEmail(username);
    } catch (ElementNotFoundException e) {
      log.error(e.getMessage(), e);
      throw new UsernameNotFoundException(e.getMessage(), e);
    }
    return org.springframework.security.core.userdetails.User
        .withUsername(foundUser.getEmail())
        .password(foundUser.getPassword())
        .disabled(!foundUser.isEnabled())
        .build();
  }
}
