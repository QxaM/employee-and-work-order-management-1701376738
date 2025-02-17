package org.maxq.authorization.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.GetUserDto;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;

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
    UserDto userDto = new UserDto("test@test.com", "test");

    // When
    User user = userMapper.mapToUser(userDto);

    // Then
    assertEquals(userDto.getEmail(), user.getEmail(), "Mapper should map to same email!");
    assertTrue(passwordEncoder.matches(userDto.getPassword(), user.getPassword()), "Mapper should map to same password!");
  }

  @Test
  void shouldMapToGetUserDtoList() {
    // Given
    Role role = new Role(1L, "TEST", Collections.emptyList());
    User user1 = new User(1L, "test1@test.com", "test1", false, List.of(role));
    User user2 = new User(2L, "test2@test.com", "test2", false, List.of(role));
    List<User> users = List.of(user1, user2);

    // When
    List<GetUserDto> getUserDtoList = userMapper.mapToGetUserDtoList(users);

    // Then
    assertAll(
        () -> assertEquals(users.size(), getUserDtoList.size(), "Sizes should match after mapping"),
        () -> assertEquals(users.getFirst().getId(), getUserDtoList.getFirst().getId(),
            "User IDs should match after mapping"),
        () -> assertEquals(
            users.getFirst().getRoles().getFirst().getId(),
            getUserDtoList.getFirst().getRoles().getFirst().getId(),
            "Role IDs should match after mapping")
    );
  }
}