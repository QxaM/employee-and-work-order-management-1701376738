package org.maxq.profileservice.domain;

import jakarta.annotation.Nullable;
import lombok.Getter;

import java.util.Optional;
import java.util.UUID;


@Getter
public final class InMemoryFile {

  private final String name;
  private final String contentType;
  private final byte[] data;

  private InMemoryFile(String contentType, String name, byte[] data) {
    this.contentType = contentType;
    this.name = name;
    this.data = data;
  }

  public static InMemoryFile create(byte[] data, @Nullable String contentType) {
    String fileName = UUID.randomUUID().toString();
    String fileExtension = Optional.ofNullable(contentType)
        .map(ct -> {
          int slashIndex = ct.lastIndexOf('/');
          return slashIndex >= 0 && slashIndex < ct.length() - 1
              ? "." + ct.substring(slashIndex + 1)
              : "";
        })
        .orElse("");
    return new InMemoryFile(contentType, fileName + fileExtension, data);
  }
}
