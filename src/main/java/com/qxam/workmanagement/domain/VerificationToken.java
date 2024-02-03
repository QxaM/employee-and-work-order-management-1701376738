package com.qxam.workmanagement.domain;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("verification_token")
@Getter
@AllArgsConstructor
public class VerificationToken {

  private static final int EXPIRATION = 60;

  @Id private final ObjectId id;

  private final UUID token;

  @Field("user_id")
  private final ObjectId userId;
}
