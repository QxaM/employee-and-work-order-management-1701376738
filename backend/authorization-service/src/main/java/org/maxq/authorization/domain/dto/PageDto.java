package org.maxq.authorization.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T> {
  private List<T> content;
  private boolean first;
  private boolean last;
  private boolean empty;
  private int totalPages;
  private int number;
  private int size;
  private long totalElements;
  private int numberOfElements;
}
