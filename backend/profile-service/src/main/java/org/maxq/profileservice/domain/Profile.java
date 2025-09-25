package org.maxq.profileservice.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "PROFILES",
    indexes = {
        @Index(name = "profile_email_idx", columnList = "email", unique = true)
    })
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Profile {

  @Id
  @GeneratedValue(generator = "profile_seq")
  @SequenceGenerator(name = "profile_seq", sequenceName = "PROFILE_SEQ", allocationSize = 1)
  private Long id;

  @NotNull
  private String email;

  @NotNull
  private String firstName;

  private String middleName;

  @NotNull
  private String lastName;

  @OneToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(name = "profile_image_id", referencedColumnName = "id")
  private ProfileImage profileImage;

  public Profile(Long id, String email, String firstName, String middleName, String lastName) {
    this.id = id;
    this.lastName = lastName;
    this.middleName = middleName;
    this.firstName = firstName;
    this.email = email;
  }

  public Profile(String email, String firstName, String middleName, String lastName) {
    this.lastName = lastName;
    this.middleName = middleName;
    this.firstName = firstName;
    this.email = email;
  }

  public Profile(String email, String firstName, String lastName) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.email = email;
  }
}
