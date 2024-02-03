package com.qxam.workmanagement.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
@Getter
@AllArgsConstructor
@Builder
public class User {

  @Id private final ObjectId id;

  @Indexed(unique = true)
  private final String email;

  private final String password;

  @Setter private boolean enabled;
}
