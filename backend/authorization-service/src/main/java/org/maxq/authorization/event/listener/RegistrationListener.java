package org.maxq.authorization.event.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.Profile;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.dto.TaskUserDto;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.event.message.RabbitmqMessage;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.VerificationTokenService;
import org.maxq.authorization.service.mail.MailService;
import org.maxq.authorization.service.message.MessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RegistrationListener implements ApplicationListener<OnRegistrationComplete> {

  private final VerificationTokenService verificationTokenService;
  private final MailService emailService;
  private final UserMapper userMapper;
  private final MessageService<RabbitmqMessage<?>> profileMessageService;
  private final MessageService<RabbitmqMessage<?>> taskMessageService;

  @Value("${profile.topic.create}")
  private String profileCreateTopic;

  @Value("${task.topic.create}")
  private String userCreateTopic;

  @Override
  @Async
  public void onApplicationEvent(OnRegistrationComplete event) {
    User user = event.getUser();
    Profile profile = event.getProfile();

    log.debug("Sending profile create message for {}", profile.getEmail());
    RabbitmqMessage<Profile> message = new RabbitmqMessage<>(profile, profileCreateTopic);
    profileMessageService.sendMessage(message);

    TaskUserDto userDto = userMapper.mapToTaskUserDto(user);
    RabbitmqMessage<TaskUserDto> userMessage = new RabbitmqMessage<>(userDto, userCreateTopic);
    taskMessageService.sendMessage(userMessage);

    VerificationToken savedToken = verificationTokenService.createToken(user);

    log.debug("Token created, sending verification email.");
    emailService.sendVerificationEmail(user.getEmail(), savedToken.getToken());
  }

  @Override
  public boolean supportsAsyncExecution() {
    return true;
  }
}
