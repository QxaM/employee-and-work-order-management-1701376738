package org.maxq.profileservice.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileDto {

  @NotBlank(message = "First name cannot be empty")
  private String firstName;
  private String middleName;
  @NotBlank(message = "Last name cannot be empty")
  private String lastName;
}
