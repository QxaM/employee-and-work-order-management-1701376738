package org.maxq.taskservice.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User {

  private Long id;
  private String email;
  private Set<Role> roles;

}
