package org.maxq.profileservice.service.image.upload;

import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.domain.exception.BucketOperationException;

public interface ImageUploadService {

  BucketOperationResponse getImage(String imageName) throws BucketOperationException;

  BucketOperationResponse uploadImage(InMemoryFile file);

  BucketOperationResponse deleteImage(String imageName);
}
