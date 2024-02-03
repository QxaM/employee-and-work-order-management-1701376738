package com.qxam.workmanagement.domain.events;

import com.qxam.workmanagement.domain.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnRegistrationComplete extends ApplicationEvent {

  private final User registeredUser;
  private final String appUrl;

  public OnRegistrationComplete(Object source, User registeredUser, String appUrl) {
    super(source);
    this.registeredUser = registeredUser;
    this.appUrl = appUrl;
  }
}
