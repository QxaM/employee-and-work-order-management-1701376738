package org.maxq.profileservice.mapper;

import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.ImageDto;
import org.springframework.stereotype.Service;

@Service
public class InMemoryFileMapper {

  public ImageDto mapToImageDto(InMemoryFile file) {
    return new ImageDto(file.getName(), file.getContentType(), file.getData());
  }
}
