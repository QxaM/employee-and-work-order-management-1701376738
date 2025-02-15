package org.maxq.authorization.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "USERS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class User {

  @Id
  @GeneratedValue(generator = "user_seq")
  @SequenceGenerator(name = "user_seq", sequenceName = "USER_SEQ",
      allocationSize = 1)
  private Long id;

  @NotNull
  @Column(unique = true)
  private String email;

  @NotNull
  @Length(min = 4)
  @Setter
  private String password;

  @NotNull
  @Setter
  private boolean enabled;

  public User(String email, String password) {
    this.password = password;
    this.email = email;
    this.enabled = false;
  }

  public User(String email, String password, boolean enabled) {
    this.password = password;
    this.email = email;
    this.enabled = enabled;
  }
}
