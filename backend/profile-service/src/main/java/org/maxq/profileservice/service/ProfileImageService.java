package org.maxq.profileservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.domain.ProfileImage;
import org.maxq.profileservice.domain.dto.BucketOperationResponse;
import org.maxq.profileservice.domain.exception.BucketOperationException;
import org.maxq.profileservice.domain.exception.FileValidationException;
import org.maxq.profileservice.service.image.upload.ImageUploadService;
import org.maxq.profileservice.service.validation.ValidationServiceFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileImageService {

  private final ValidationServiceFactory validationFactory;
  private final ImageUploadService uploadService;

  public InMemoryFile validateAndReturnImage(MultipartFile file) throws FileValidationException, IOException {
    validationFactory.createImageValidationService(file)
        .validateName()
        .validateExtension()
        .validateContentType()
        .validateSize()
        .validate();

    InMemoryFile newFile = InMemoryFile.create(file.getBytes(), file.getContentType());
    log.info("New file: {}", newFile.getName());

    validationFactory.createImageContentValidationService(newFile)
        .validateSignature()
        .validateRealContent()
        .validateMetadata()
        .validate();

    return newFile;
  }

  public Resource getProfileImageFromStorage(ProfileImage image) throws BucketOperationException {
    BucketOperationResponse response = uploadService.getImage(image.getName());
    return new ByteArrayResource(response.getData());
  }
}
