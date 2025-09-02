package org.maxq.profileservice.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileDto {

  @NotNull
  private String firstName;
  private String middleName;
  @NotNull
  private String lastName;
}
