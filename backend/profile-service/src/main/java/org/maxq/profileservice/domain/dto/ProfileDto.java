package org.maxq.profileservice.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class ProfileDto {

  private Long id;
  private String email;
  private String firstName;
  private String middleName;
  private String lastName;
}
