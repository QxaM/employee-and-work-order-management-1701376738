package org.maxq.profileservice.service.validation;

import org.junit.jupiter.api.Test;
import org.maxq.profileservice.service.validation.file.ImageValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class ValidationServiceFactoryTest {

  @Autowired
  private ValidationServiceFactory factory;

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
}