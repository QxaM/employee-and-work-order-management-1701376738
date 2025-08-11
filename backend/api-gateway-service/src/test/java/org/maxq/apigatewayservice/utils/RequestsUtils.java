package org.maxq.apigatewayservice.utils;

import org.springframework.http.HttpMethod;

import java.util.stream.Stream;

public final class RequestsUtils {

  private RequestsUtils() {
  }

  public static Stream<HttpMethod> buildAllowedMethods(HttpMethod... allowedMethods) {
    return Stream.of(allowedMethods);
  }

  public static Stream<HttpMethod> buildDisallowedMethods(HttpMethod... allowedMethods) {
    return Stream.of(HttpMethod.values())
        .filter(method ->
            Stream.of(allowedMethods).noneMatch(allowedMethod ->
                allowedMethod.equals(method)
            )
        )
        .filter(method -> !method.equals(HttpMethod.TRACE));
  }
}
