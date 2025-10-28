package org.maxq.authorization.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.PageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class PageableMapperTest {

  @Autowired
  private PageableMapper mapper;

  @Test
  void shouldMapToPageDto() {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user1 = new User(1L, "test1@test.com", "test1", false, Set.of(role));
    User user2 = new User(2L, "test2@test.com", "test2", false, Set.of(role));
    List<User> users = List.of(user1, user2);
    Pageable page = Pageable.ofSize(10).withPage(0);
    Page<User> userPage = new PageImpl<>(users, page, users.size());

    // When
    PageDto<User> mappedPage = mapper.mapToPageDto(userPage);

    // Then
    assertAll(
        () -> assertEquals(users.size(), mappedPage.getContent().size(),
            "Sizes should match after mapping"),
        () -> assertEquals(users.getFirst().getId(), mappedPage.getContent().getFirst().getId(), "User IDs should match"),
        () -> assertEquals(users.get(1).getId(), mappedPage.getContent().get(1).getId(), "User IDs should match")
    );
    assertAll(
        () -> assertEquals(userPage.isFirst(), mappedPage.isFirst(),
            "Is first not mapped correctly"),
        () -> assertEquals(userPage.isLast(), mappedPage.isLast(),
            "Is empty not mapped correctly"),
        () -> assertEquals(userPage.isEmpty(), mappedPage.isEmpty(),
            "Is empty not mapped correctly")
    );
    assertAll(
        () -> assertEquals(userPage.getTotalPages(), mappedPage.getTotalPages(),
            "Total pages not mapped correctly"),
        () -> assertEquals(userPage.getNumber(), mappedPage.getNumber(),
            "Page number not mapped correctly")
    );
    assertAll(
        () -> assertEquals(userPage.getSize(), mappedPage.getSize(),
            "Page size not mapped correctly"),
        () -> assertEquals(userPage.getTotalElements(), mappedPage.getTotalElements(),
            "Total elements size not mapped correctly"),
        () -> assertEquals(userPage.getNumberOfElements(), mappedPage.getNumberOfElements(),
            "Number of elements size not mapped correctly")
    );
  }
}