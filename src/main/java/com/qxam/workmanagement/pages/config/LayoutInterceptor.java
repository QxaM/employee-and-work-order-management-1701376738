package com.qxam.workmanagement.pages.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class LayoutInterceptor implements HandlerInterceptor {

  private static final String DEFAULT_LAYOUT = "layouts/default-layout";
  private static final String VIEW_ATTRIBUTE_NAME = "view";

  @Override
  public void postHandle(
      HttpServletRequest request,
      HttpServletResponse response,
      Object handler,
      ModelAndView modelAndView) {
    if (modelAndView != null && modelAndView.hasView()) {
      String viewName = modelAndView.getViewName();
      modelAndView.setViewName(DEFAULT_LAYOUT);
      modelAndView.addObject(VIEW_ATTRIBUTE_NAME, viewName);
    }
  }
}
