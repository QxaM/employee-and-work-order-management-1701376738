package org.maxq.profileservice.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HttpValidationStatus {

  private String message;
  private Set<ValidationError> errors;
}
