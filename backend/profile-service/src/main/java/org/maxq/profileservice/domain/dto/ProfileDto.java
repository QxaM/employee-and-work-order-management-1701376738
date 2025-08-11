package org.maxq.profileservice.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ProfileDto {

  private String email;
  private String firstName;
  private String middleName;
  private String lastName;
}
