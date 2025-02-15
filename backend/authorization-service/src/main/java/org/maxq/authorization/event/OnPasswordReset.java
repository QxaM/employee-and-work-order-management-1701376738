package org.maxq.authorization.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnPasswordReset extends ApplicationEvent {

  private final String email;

  public OnPasswordReset(String email) {
    super(email);
    this.email = email;
  }
}
