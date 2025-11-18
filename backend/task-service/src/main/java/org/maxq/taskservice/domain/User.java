package org.maxq.taskservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Table(
    name = "USERS"
)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User {

  @Id
  private Long id;

  @Column(unique = true, nullable = false)
  private String email;

  @ManyToMany(
      fetch = FetchType.EAGER,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}
  )
  @JoinTable(
      name = "USER_ROLE",
      joinColumns = @JoinColumn(name = "USER_ID"),
      inverseJoinColumns = @JoinColumn(name = "ROLE_ID")
  )
  private Set<Role> roles;

  @OneToMany(mappedBy = "user")
  private List<Task> tasks;

  public User(Long id, String email, Set<Role> roles) {
    this.id = id;
    this.email = email;
    this.roles = roles;
  }
}
