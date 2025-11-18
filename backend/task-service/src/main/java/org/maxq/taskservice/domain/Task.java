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
  @GeneratedValue(generator = "task_seq")
  @SequenceGenerator(name = "task_seq", sequenceName = "TASK_SEQ", allocationSize = 1)
  private Long id;
  private String title;
  private String description;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
  @JoinColumn(name = "USER_ID")
  private User user;

  public Task(String title, String description, User user) {
    this.title = title;
    this.description = description;
    this.user = user;
  }
}
