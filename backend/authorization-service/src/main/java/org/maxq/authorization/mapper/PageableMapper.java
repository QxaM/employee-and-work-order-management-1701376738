package org.maxq.authorization.mapper;

import org.maxq.authorization.domain.dto.PageDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class PageableMapper {

  public <T> PageDto<T> mapToPageDto(Page<T> page) {
    return PageDto.<T>builder()
        .content(page.getContent())
        .first(page.isFirst())
        .last(page.isLast())
        .empty(page.isEmpty())
        .totalPages(page.getTotalPages())
        .number(page.getNumber())
        .size(page.getSize())
        .totalElements(page.getTotalElements())
        .numberOfElements(page.getNumberOfElements())
        .build();
  }
}
