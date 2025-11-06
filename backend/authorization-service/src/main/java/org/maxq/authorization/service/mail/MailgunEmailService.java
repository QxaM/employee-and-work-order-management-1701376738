package org.maxq.authorization.service.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.client.MailgunClient;
import org.maxq.authorization.domain.dto.MailgunDto;
import org.maxq.authorization.domain.dto.MailgunResponseDto;
import org.maxq.authorization.mapper.MailgunMapper;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Map;

@Primary
@Service
@Slf4j
@RequiredArgsConstructor
@Profile("!QA & !SIT")
public class MailgunEmailService implements MailService {

  private final MailgunDtoCreatorService creatorService;
  private final MailgunMapper mailgunMapper;
  private final MailgunClient mailgunClient;

  @Override
  public void sendPasswordReset(String email, String token) {
    log.info("Sending password reset email through Mailgun");
    MailgunDto mailgunDto = creatorService.buildPasswordResetEmail(token, email);
    Map<String, String> parts = mailgunMapper.mapToFormParts(mailgunDto);
    MailgunResponseDto response = mailgunClient.postEmail(parts);
    logResponse(response);
  }

  @Override
  public void sendVerificationEmail(String email, String token) {
    log.info("Sending verification email through Mailgun");
    MailgunDto mailgunDto = creatorService.buildVerificationEmail(token, email);
    log.info("Sending DTO: {}", mailgunDto);
    Map<String, String> parts = mailgunMapper.mapToFormParts(mailgunDto);
    MailgunResponseDto response = mailgunClient.postEmail(parts);
    logResponse(response);
  }

  private void logResponse(MailgunResponseDto response) {
    log.info("Mailgun response: {}", response);
  }
}
