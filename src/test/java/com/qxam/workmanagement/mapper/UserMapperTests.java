package com.qxam.workmanagement.mapper;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.qxam.workmanagement.domain.User;
import com.qxam.workmanagement.domain.dto.UserDto;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserMapperTests {

  @Autowired private UserMapper userMapper;

  @Test
  void shouldMapToUserDto() {
    // Given
    User user = new User(new ObjectId(), "example@example.com", "12345");

    // When
    UserDto userDto = userMapper.mapToUserDto(user);

    // Then
    assertAll(
        () -> assertEquals(user.getId(), userDto.getId()),
        () -> assertEquals(user.getEmail(), userDto.getEmail()),
        () -> assertEquals(user.getPassword(), userDto.getPassword()));
  }

  @Test
  void shouldMapToUser() {
    // Given
    UserDto userDto = new UserDto(new ObjectId(), "example@example.com", "12345");

    // When
    User user = userMapper.mapToUser(userDto);

    // Then
    assertAll(
        () -> assertEquals(userDto.getId(), user.getId()),
        () -> assertEquals(userDto.getEmail(), user.getEmail()),
        () -> assertEquals(userDto.getPassword(), user.getPassword()));
  }
}
