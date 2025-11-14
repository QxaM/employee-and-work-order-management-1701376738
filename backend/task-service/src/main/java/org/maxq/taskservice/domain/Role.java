package org.maxq.taskservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(
    name = "ROLES"
)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Role {

  @Id
  private Long id;

  @Column(unique = true)
  private String name;

  @ManyToMany(mappedBy = "roles")
  private List<User> users;

}
