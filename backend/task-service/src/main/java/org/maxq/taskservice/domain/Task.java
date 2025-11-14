package org.maxq.taskservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TASKS")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Task {

  @Id
  private Long id;
  private String title;
  private String description;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
  @JoinColumn(name = "USER_ID")
  private User user;

}
