package org.maxq.authorization.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ROLES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode(exclude = {"users"})
public class Role {

  @Id
  @GeneratedValue(generator = "role_seq")
  @SequenceGenerator(
      name = "role_seq", sequenceName = "ROLE_SEQ",
      allocationSize = 1
  )
  private Long id;

  @NotNull
  @Column(unique = true)
  private String name;

  @ManyToMany(mappedBy = "roles")
  private List<User> users;

  public Role(String name) {
    this.name = name;
    users = new ArrayList<>();
  }
}
