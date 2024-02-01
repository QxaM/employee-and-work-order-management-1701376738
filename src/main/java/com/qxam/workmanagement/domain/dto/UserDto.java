package com.qxam.workmanagement.domain.dto;

import com.qxam.workmanagement.domain.validator.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.bson.types.ObjectId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

  private ObjectId id;

  @Email(
      message = "Enter correct email",
      regexp = "^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
  @NotEmpty(message = "Email cannot be empty")
  private String email;

  @ValidPassword private String password;
}
