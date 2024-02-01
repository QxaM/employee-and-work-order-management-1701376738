package com.qxam.workmanagement.security;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.exception.ElementNotFound;
import com.qxam.workmanagement.service.UserDbService;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetails implements UserDetailsService {

  @Autowired private UserDbService service;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User foundUser;
    try {
      foundUser = service.findUserByEmail(email);
    } catch (ElementNotFound e) {
      throw new UsernameNotFoundException("User details not found for the user: " + email);
    }

    return new org.springframework.security.core.userdetails.User(
        foundUser.getEmail(), foundUser.getPassword(), Collections.emptyList());
  }
}
