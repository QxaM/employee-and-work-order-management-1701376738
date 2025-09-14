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
    InMemoryFile file = InMemoryFile.create("test-data".getBytes(), "image/jpg");

    // When
    ImageDto imageDto = inMemoryFileMapper.mapToImageDto(file);

    // Then
    assertAll(
        () -> assertEquals(file.getName(), imageDto.getName(), "Wrong name"),
        () -> assertEquals(file.getContentType(), imageDto.getContentType(), "Wrong content type"),
        () -> assertArrayEquals(file.getData(), imageDto.getData(), "Wrong data")
    );
  }
}