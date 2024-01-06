package com.qxam.workmanagement.domain.dto;

import com.qxam.workmanagement.domain.validator.ValidPassword;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.bson.types.ObjectId;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

  private ObjectId id;

  @Email(message = "Enter correct email!")
  private String email;

  @ValidPassword private String password;
}
