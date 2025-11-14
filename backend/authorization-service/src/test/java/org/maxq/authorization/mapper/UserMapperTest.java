package org.maxq.authorization.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserMapperTest {

  @Autowired
  private UserMapper userMapper;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Test
  void shouldAddToUser() {
    // Given
    UserDto userDto = new UserDto("Test", null, "User", "test@test.com", "test");

    // When
    User user = userMapper.mapToUser(userDto);

    // Then
    assertEquals(userDto.getEmail(), user.getEmail(), "Mapper should map to same email!");
    assertTrue(passwordEncoder.matches(userDto.getPassword(), user.getPassword()),
        "Mapper should map to same password!");
  }

  @Test
  void shouldMapToGetUserDtoList() {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user1 = new User(1L, "test1@test.com", "test1", false, Set.of(role));
    User user2 = new User(2L, "test2@test.com", "test2", false, Set.of(role));
    List<User> users = List.of(user1, user2);
    Pageable page = Pageable.ofSize(10).withPage(0);
    Page<User> userPage = new PageImpl<>(users, page, users.size());

    // When
    PageDto<GetUserDto> getUserDtoPage = userMapper.mapToGetUserDtoPage(userPage);

    // Then
    assertAll(
        () -> assertEquals(users.size(), getUserDtoPage.getNumberOfElements(),
            "Sizes should match after mapping"),
        () -> assertEquals(users.getFirst().getId(), getUserDtoPage.getContent().getFirst().getId(),
            "User IDs should match after mapping"),
        () -> assertEquals(
            users.getFirst().getRoles().size(),
            getUserDtoPage.getContent().getFirst().getRoles().size(),
            "Roles should match after mapping"),
        () -> assertEquals(userPage.getTotalElements(), getUserDtoPage.getTotalElements(),
            "Total elements should match after mapping"),
        () -> assertEquals(userPage.getTotalPages(), getUserDtoPage.getTotalPages(),
            "Total pages should match after mapping")
    );
  }

  @Test
  void shouldMapToMeDto() {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user1 = new User(1L, "test1@test.com", "test1", false, Set.of(role));

    // When
    MeDto me = userMapper.mapToMeDto(user1);

    // Then
    assertAll(
        () -> assertEquals(user1.getEmail(), me.getEmail(),
            "User emails should match after mapping"),
        () -> assertEquals(1, me.getRoles().size(), "Roles length not match after mapping"),
        () -> assertEquals(role.getId(), me.getRoles().getFirst().getId(),
            "Role ID not match after mapping"),
        () -> assertEquals(role.getName(), me.getRoles().getFirst().getName(),
            "Role name not match after mapping")
    );
  }

  @Test
  void shouldMapToTaskUserDto() {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user1 = new User(1L, "test1@test.com", "test1", false, Set.of(role));

    // When
    TaskUserDto userDto = userMapper.mapToTaskUserDto(user1);

    // Then
    assertAll(
        () -> assertEquals(user1.getId(), userDto.getId(), "Id not mapped correctly"),
        () -> assertEquals(user1.getEmail(), userDto.getEmail(), "Email not mapped correctly"),
        () -> assertEquals(user1.getRoles().size(), userDto.getRoles().size(),
            "Email not mapped correctly"),
        () -> assertEquals(
            user1.getRoles().stream().toList().getFirst().getId(),
            userDto.getRoles().getFirst().getId(),
            "Role id not mapped correctly"
        ),
        () -> assertEquals(
            user1.getRoles().stream().toList().getFirst().getName(),
            userDto.getRoles().getFirst().getName(),
            "Role name not mapped correctly"
        )
    );
  }
}