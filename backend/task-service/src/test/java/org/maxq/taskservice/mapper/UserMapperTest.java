package org.maxq.taskservice.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.taskservice.domain.User;
import org.maxq.taskservice.domain.dto.RoleDto;
import org.maxq.taskservice.domain.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserMapperTest {

  @Autowired
  private UserMapper userMapper;

  @Test
  void shouldMapToUser() {
    // Given
    RoleDto roleDto = new RoleDto(1L, "ROLE_TEST");
    UserDto userDto = new UserDto(1L, "test@test.com", List.of(roleDto));

    // When
    User user = userMapper.mapToUser(userDto);

    // Then
    assertAll(
        () -> assertEquals(userDto.getId(), user.getId(), "Id not mapped correctly"),
        () -> assertEquals(userDto.getEmail(), user.getEmail(), "Email not mapped correctly"),
        () -> assertEquals(userDto.getRoles().size(), user.getRoles().size(),
            "Roles size does not match - not mapped correctly"),
        () -> assertEquals(
            userDto.getRoles().getFirst().getId(),
            user.getRoles().stream().toList().getFirst().getId(),
            "Role id does not match - not mapped correctly"
        ),
        () -> assertEquals(
            userDto.getRoles().getFirst().getName(),
            user.getRoles().stream().toList().getFirst().getName(),
            "Roles name does not match - not mapped correctly"
        )
    );
  }
}