package org.maxq.profileservice.service.image.upload;

import org.maxq.profileservice.domain.InMemoryFile;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

public interface ImageUploadService {

  PutObjectResponse uploadImage(InMemoryFile file);
}
