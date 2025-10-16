package org.maxq.authorization.mapper;

import org.maxq.authorization.domain.Profile;
import org.maxq.authorization.domain.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public class ProfileMapper {

  public Profile mapToProfile(UserDto userDto) {
    return new Profile(
        userDto.getEmail(),
        userDto.getFirstName(),
        userDto.getMiddleName(),
        userDto.getLastName()
    );
  }
}
