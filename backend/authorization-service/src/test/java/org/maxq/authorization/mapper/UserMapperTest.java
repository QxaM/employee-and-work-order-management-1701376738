package org.maxq.authorization.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.User;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class UserMapperTest {

  @Autowired
  private UserMapper userMapper;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Test
  void shouldAddToUSer() {
    // Given
    UserDto userDto = new UserDto(1L, "test@test.com", "test");

    // When
    User user = userMapper.mapToUser(userDto);

    // Then
    assertEquals(userDto.getId(), user.getId(), "Mapper should map to same id!");
    assertEquals(userDto.getEmail(), user.getEmail(), "Mapper should map to same email!");
    assertTrue(passwordEncoder.matches(userDto.getPassword(), user.getPassword()), "Mapper should map to same password!");
  }
}