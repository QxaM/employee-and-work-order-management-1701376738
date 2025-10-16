package org.maxq.authorization.event;

import lombok.Getter;
import org.maxq.authorization.domain.Profile;
import org.maxq.authorization.domain.User;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnRegistrationComplete extends ApplicationEvent {

  private final transient User user;
  private final transient Profile profile;

  public OnRegistrationComplete(User user, Profile profile) {
    super(user);
    this.user = user;
    this.profile = profile;
  }
}
