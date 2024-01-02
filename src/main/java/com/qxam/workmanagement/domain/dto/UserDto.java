package com.qxam.workmanagement.domain.dto;

import lombok.*;
import org.bson.types.ObjectId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

  private ObjectId id;
  private String email;
  private String password;
}
