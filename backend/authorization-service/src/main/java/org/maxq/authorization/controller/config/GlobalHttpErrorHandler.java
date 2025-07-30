package org.maxq.authorization.controller.config;

import lombok.extern.slf4j.Slf4j;
import org.maxq.authorization.domain.HttpErrorMessage;
import org.maxq.authorization.domain.exception.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalHttpErrorHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(DuplicateEmailException.class)
  public ResponseEntity<HttpErrorMessage> handleDuplicateEmailException(DuplicateEmailException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(DataValidationException.class)
  public ResponseEntity<HttpErrorMessage> handleDataValidationException(DataValidationException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ElementNotFoundException.class)
  public ResponseEntity<HttpErrorMessage> handleElementNotFoundException(ElementNotFoundException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(ExpiredVerificationToken.class)
  public ResponseEntity<HttpErrorMessage> handleExpiredVerificationTokenException(ExpiredVerificationToken e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @ExceptionHandler(RoleAlreadyExistsException.class)
  public ResponseEntity<HttpErrorMessage> handleRoleAlreadyExistsException(RoleAlreadyExistsException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(RoleDoesNotExistException.class)
  public ResponseEntity<HttpErrorMessage> handleRoleDoesNotExistException(RoleDoesNotExistException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    log.error(ex.getMessage(), ex);
    String message = "Validation exception error";
    if (ex.getBindingResult().hasErrors()) {
      message = ex.getBindingResult().getFieldErrors().getFirst().getDefaultMessage();
    }
    return new ResponseEntity<>(new HttpErrorMessage(message), HttpStatus.BAD_REQUEST);
  }

  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    log.error(ex.getMessage(), ex);
    return new ResponseEntity<>(new HttpErrorMessage(ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @Override
  protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    log.error(ex.getMessage(), ex);
    String message = String.format("Request method %s not supported", ex.getMethod());
    return new ResponseEntity<>(new HttpErrorMessage(message), HttpStatus.METHOD_NOT_ALLOWED);
  }


}
