package org.maxq.profileservice.mapper;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class InMemoryFileMapperTest {

  @Autowired
  private InMemoryFileMapper inMemoryFileMapper;

  @Test
  void shouldMapToImageDto() {
    // Given
    String email = "test@test.com";
    InMemoryFile file = InMemoryFile.create("test-data".getBytes(), "image/jpg");

    // When
    ImageDto imageDto = inMemoryFileMapper.mapToImageDto(file, email);

    // Then
    assertAll(
        () -> assertEquals(email, imageDto.getUserEmail(), "Wrong email"),
        () -> assertEquals(file.getName(), imageDto.getName(), "Wrong name"),
        () -> assertEquals(file.getContentType(), imageDto.getContentType(), "Wrong content type"),
        () -> assertArrayEquals(file.getData(), imageDto.getData(), "Wrong data")
    );
  }

  @Test
  void shouldMapToInMemoryFile() {
    // Given
    ImageDto imageDto = new ImageDto("test@test.com", "test.jpg", "image/jpeg", "test-data".getBytes());

    // When
    InMemoryFile file = inMemoryFileMapper.mapToInMemoryFile(imageDto);

    // Then
    assertAll(
        () -> assertEquals(imageDto.getName(), file.getName(), "Wrong name"),
        () -> assertEquals(imageDto.getContentType(), file.getContentType(), "Wrong content type"),
        () -> assertArrayEquals(imageDto.getData(), file.getData(), "Wrong data")
    );
  }
}