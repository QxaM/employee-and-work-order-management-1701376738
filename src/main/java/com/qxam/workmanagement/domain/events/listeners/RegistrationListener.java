package com.qxam.workmanagement.domain.events.listeners;

import com.qxam.workmanagement.domain.events.OnRegistrationComplete;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class RegistrationListener implements ApplicationListener<OnRegistrationComplete> {

  @Override
  public void onApplicationEvent(@NonNull OnRegistrationComplete event) {
    sendConfirmRegistrationEmail(event);
  }

  private void sendConfirmRegistrationEmail(OnRegistrationComplete event) {}
}
