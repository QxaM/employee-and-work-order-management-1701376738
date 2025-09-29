package org.maxq.profileservice.config.controller;

import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.HttpErrorMessage;
import org.maxq.profileservice.domain.HttpValidationStatus;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.ElementNotFoundException;
import org.maxq.profileservice.domain.exception.FileValidationException;
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
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalHttpErrorHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(ElementNotFoundException.class)
  public ResponseEntity<HttpErrorMessage> handleElementNotFoundException(ElementNotFoundException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(FileValidationException.class)
  public ResponseEntity<HttpValidationStatus> handleFileValidationException(FileValidationException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(
        new HttpValidationStatus(e.getMessage(), e.getValidationResult().getMessages()),
        HttpStatus.BAD_REQUEST
    );
  }

  @ExceptionHandler(BucketOperationException.class)
  public ResponseEntity<HttpErrorMessage> handleBucketOperationException(BucketOperationException e) {
    log.error(e.getMessage(), e);
    return new ResponseEntity<>(new HttpErrorMessage(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
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

  @Override
  protected ResponseEntity<Object> handleMissingServletRequestPart(MissingServletRequestPartException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    log.error(ex.getMessage(), ex);
    return new ResponseEntity<>(new HttpErrorMessage(ex.getMessage()), HttpStatus.BAD_REQUEST);
  }
}
