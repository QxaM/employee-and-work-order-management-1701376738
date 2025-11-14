package org.maxq.taskservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

  @Setter
  @ManyToMany(mappedBy = "roles")
  private List<User> users;

}
