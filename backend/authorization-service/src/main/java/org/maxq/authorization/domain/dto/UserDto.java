package org.maxq.authorization.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserDto {

  @NotBlank(message = "First name cannot be empty")
  private String firstName;

  private String middleName;

  @NotBlank(message = "Last name cannot be empty")
  private String lastName;

  @NotBlank(message = "Email cannot be empty")
  private String email;

  @Size(min = 4, message = "The password have to be at least 4 characters long")
  @NotBlank(message = "Password cannot be empty")
  private String password;
}
