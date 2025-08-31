package org.maxq.authorization.event;

import lombok.Getter;
import org.maxq.authorization.domain.User;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnRegisterVerificationFail extends ApplicationEvent {

  private final transient User user;

  public OnRegisterVerificationFail(User source) {
    super(source);
    this.user = source;
  }
}
