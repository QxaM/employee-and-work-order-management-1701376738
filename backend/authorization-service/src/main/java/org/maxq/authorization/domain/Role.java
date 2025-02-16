package org.maxq.authorization.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ROLES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Role {

  @Id
  @GeneratedValue(generator = "role_seq")
  @SequenceGenerator(name = "role_seq", sequenceName = "ROLE_SEQ",
      allocationSize = 1)
  private Long id;

  @NotNull
  @Column(unique = true)
  private String name;
}
