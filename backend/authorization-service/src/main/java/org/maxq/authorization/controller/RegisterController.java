package org.maxq.authorization.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.maxq.authorization.controller.api.RegisterApi;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.VerificationToken;
import org.maxq.authorization.domain.dto.UserDto;
import org.maxq.authorization.domain.exception.DataValidationException;
import org.maxq.authorization.domain.exception.DuplicateEmailException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.domain.exception.ExpiredVerificationToken;
import org.maxq.authorization.event.OnRegistrationComplete;
import org.maxq.authorization.mapper.UserMapper;
import org.maxq.authorization.service.RoleService;
import org.maxq.authorization.service.UserService;
import org.maxq.authorization.service.VerificationTokenService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegisterController implements RegisterApi {

  private final UserService userService;
  private final RoleService roleService;
  private final VerificationTokenService verificationTokenService;
  private final UserMapper userMapper;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  @PostMapping
  public ResponseEntity<Void> register(@RequestBody @Valid UserDto userDto)
      throws DataValidationException, DuplicateEmailException, ElementNotFoundException {
    User user = userMapper.mapToUser(userDto);
    Role designer = roleService.findByName("DESIGNER");
    user.getRoles().add(designer);
    userService.createUser(user);

    eventPublisher.publishEvent(new OnRegistrationComplete(user));

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @Override
  @PostMapping("/confirm")
  public ResponseEntity<Void> confirmRegistration(@RequestParam String token)
      throws ElementNotFoundException, ExpiredVerificationToken, DataValidationException {
    VerificationToken foundToken = verificationTokenService.getToken(token);

    try {
      verificationTokenService.validateToken(foundToken);
    } catch (ExpiredVerificationToken e) {
      eventPublisher.publishEvent(new OnRegistrationComplete(foundToken.getUser()));
      throw e;
    }

    User enabledUser = foundToken.getUser();
    enabledUser.setEnabled(true);
    userService.updateUser(enabledUser);
    verificationTokenService.setUsed(foundToken);

    return ResponseEntity.ok().build();
  }
}
