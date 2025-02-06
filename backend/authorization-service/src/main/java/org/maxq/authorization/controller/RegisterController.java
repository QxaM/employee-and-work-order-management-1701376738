package org.maxq.authorization.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.RegisterApi;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegisterController implements RegisterApi {

  private static final Integer TOKEN_EXPIRATION_TIME = 60 * 24;

  private final UserService userService;
  private final VerificationTokenService verificationTokenService;
  private final UserMapper userMapper;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  @PostMapping
  public ResponseEntity<Void> register(@RequestBody @Valid UserDto userDto)
      throws DataValidationException, DuplicateEmailException {
    User user = userMapper.mapToUser(userDto);
    userService.createUser(user);

    eventPublisher.publishEvent(new OnRegistrationComplete(user));

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @Override
  @PostMapping("/confirm")
  public ResponseEntity<Void> confirmRegistration(@RequestParam String token)
      throws ElementNotFoundException, ExpiredVerificationToken, DataValidationException {
    VerificationToken foundToken = verificationTokenService.getToken(token);

    LocalDateTime expirationTime = foundToken.getCreationDate().plusMinutes(TOKEN_EXPIRATION_TIME);
    if (expirationTime.isBefore(LocalDateTime.now())) {
      eventPublisher.publishEvent(new OnRegistrationComplete(foundToken.getUser()));
      throw new ExpiredVerificationToken("Provided verification token expired at: " + expirationTime);
    }

    User enabledUser = foundToken.getUser();
    enabledUser.setEnabled(true);
    userService.updateUser(enabledUser);

    return ResponseEntity.ok().build();
  }
}
