package org.maxq.authorization.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

public final class RequestUtils {

  private RequestUtils() {
  }

  public static HttpServletRequest getCurrentHttpRequest() {
    Optional<RequestAttributes> requestAttributes =
        Optional.ofNullable(RequestContextHolder.getRequestAttributes());

    return requestAttributes.map(attributes ->
        ((ServletRequestAttributes) attributes).getRequest()).orElse(null);
  }
}
