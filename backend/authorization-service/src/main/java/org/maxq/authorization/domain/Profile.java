package org.maxq.authorization.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Profile {

  private final String email;
  private final String firstName;
  private final String middleName;
  private final String lastName;
}
