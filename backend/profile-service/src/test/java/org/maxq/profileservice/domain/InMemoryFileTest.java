package org.maxq.profileservice.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InMemoryFileTest {

  @Test
  void shouldCreateFile_With_ContentType() {
    // Given
    String contentType = "image/jpg";
    byte[] content = "test".getBytes();

    // When
    InMemoryFile file = InMemoryFile.create(content, contentType);

    // Then
    assertNotNull(file, "File not created");
    assertAll(
        () -> assertTrue(file.getName().endsWith(".jpg"), "File name incorrect"),
        () -> assertEquals(contentType, file.getContentType(), "Content type incorrect"),
        () -> assertArrayEquals(content, file.getData(), "Content incorrect")
    );
  }

  @Test
  void shouldCreateFile_Without_ContentType() {
    // Given
    byte[] content = "test".getBytes();

    // When
    InMemoryFile file = InMemoryFile.create(content, null);

    // Then
    assertNotNull(file, "File not created");
    assertAll(
        () -> assertFalse(file.getName().contains("."), "File should not contain extension"),
        () -> assertNull(file.getContentType(), "Content type should be null"),
        () -> assertArrayEquals(content, file.getData(), "Content incorrect")
    );
  }

}