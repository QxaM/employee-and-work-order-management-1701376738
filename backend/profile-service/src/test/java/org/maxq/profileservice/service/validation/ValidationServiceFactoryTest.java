package org.maxq.profileservice.service.validation;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.domain.InMemoryFile;
import org.maxq.profileservice.service.image.ImageService;
import org.maxq.profileservice.service.validation.file.ContentValidationService;
import org.maxq.profileservice.service.validation.file.ImageContentValidationService;
import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class ValidationServiceFactoryTest {

  @Autowired
  private ValidationServiceFactory factory;

  @MockitoBean
  private ImageService imageService;

  @Test
  void shouldCreateImageValidationService() {
    // Given
    MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", new byte[0]);

    // When
    ImageValidationService validationService = factory.createImageValidationService(file);

    // Then
    assertNotNull(validationService, "Validation service not created");
    assertEquals(ImageValidationService.class, validationService.getClass(), "Wrong validation service class");
    assertEquals(file, validationService.getFile(), "Wrong file passed to validation service");
  }

  @Test
  void shouldCreateImageContentValidationService() {
    // Given
    InMemoryFile file = InMemoryFile.create("test".getBytes(), null);

    // When
    ContentValidationService validationService = factory.createImageContentValidationService(file);

    // Then
    assertNotNull(validationService, "Validation service not created");
    assertEquals(ImageContentValidationService.class, validationService.getClass(), "Wrong validation service class");
    assertEquals(file, validationService.getFile(), "Wrong file passed to validation service");
  }
}