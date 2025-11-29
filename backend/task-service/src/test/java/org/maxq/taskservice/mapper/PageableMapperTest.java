package org.maxq.taskservice.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.Task;
import org.maxq.taskservice.domain.dto.PageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class PageableMapperTest {

  @Autowired
  private PageableMapper pageableMapper;

  @Test
  void shouldMapToPageDto() {
    // Given
    Task task = new Task(100L, "Test title", "Test description", null);
    List<Task> tasks = List.of(task);
    Page<Task> taskPage = new PageImpl<>(tasks, Pageable.ofSize(10).withPage(0), tasks.size());

    // When
    PageDto<Task> pageDto = pageableMapper.mapToPageDto(taskPage);

    // Then
    assertEquals(tasks.size(), pageDto.getContent().size(), "Content size is wrong");
    assertAll(
        () -> assertEquals(taskPage.isFirst(), pageDto.isFirst(), "First not mapped correctly"),
        () -> assertEquals(taskPage.isLast(), pageDto.isLast(), "Last not mapped correctly"),
        () -> assertEquals(taskPage.isEmpty(), pageDto.isEmpty(), "Empty not mapped correctly"),
        () -> assertEquals(
            taskPage.getTotalPages(),
            pageDto.getTotalPages(),
            "Total pages not mapped correctly"
        ),
        () -> assertEquals(
            taskPage.getNumber(),
            pageDto.getNumber(),
            "Page number not mapped correctly"
        ),
        () -> assertEquals(
            taskPage.getSize(),
            pageDto.getSize(),
            "Page size not mapped correctly"
        ),
        () -> assertEquals(
            taskPage.getTotalElements(),
            pageDto.getTotalElements(),
            "Total elements not mapped correctly"
        ),
        () -> assertEquals(
            taskPage.getNumberOfElements(),
            pageDto.getNumberOfElements(),
            "Number of elements not mapped correctly"
        )
    );
  }
}