package org.maxq.authorization.event;

import lombok.Getter;
import org.maxq.authorization.domain.User;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnRegistrationComplete extends ApplicationEvent {

  private final transient User user;

  public OnRegistrationComplete(User user) {
    super(user);
    this.user = user;
  }
}
