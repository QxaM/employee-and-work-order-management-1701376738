package org.maxq.authorization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "VERIFICATION_TOKEN", indexes = {
    @Index(name = "token_idx", columnList = "token")
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class VerificationToken {

  @Id
  @GeneratedValue(generator = "token_seq")
  @SequenceGenerator(name = "token_seq", sequenceName = "TOKEN_SEQ",
      allocationSize = 1)
  private Long id;

  @Column(unique = true, nullable = false)
  private String token;

  @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
  @JoinColumn(name = "USER_ID")
  private User user;

  @Column(name = "CREATION_DATE")
  @Setter
  private LocalDateTime creationDate;

  public VerificationToken(String token, User user, LocalDateTime creationDate) {
    this.token = token;
    this.user = user;
    this.creationDate = creationDate;
  }
}
