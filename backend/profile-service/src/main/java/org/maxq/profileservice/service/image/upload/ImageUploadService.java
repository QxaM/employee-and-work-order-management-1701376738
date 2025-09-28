package org.maxq.profileservice.service.image.upload;

import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;

public interface ImageUploadService {

  BucketOperationResponse uploadImage(InMemoryFile file);

  BucketOperationResponse deleteImage(String imageName);
}
