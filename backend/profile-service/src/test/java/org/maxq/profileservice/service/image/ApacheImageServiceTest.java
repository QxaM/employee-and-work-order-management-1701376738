package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.ImagingException;
import org.apache.commons.imaging.common.ImageMetadata;
import org.apache.commons.imaging.formats.jpeg.JpegImageMetadata;
import org.apache.commons.imaging.formats.tiff.TiffField;
import org.apache.commons.imaging.formats.tiff.TiffImageMetadata;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.maxq.profileservice.domain.ImageSize;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
class ApacheImageServiceTest {

  private static final int DIMENSION = 8 * 1024;

  @Mock
  private JpegImageMetadata metadata;
  @Mock
  private TiffImageMetadata tiffMetadata;
  @Mock
  private TiffField width;
  @Mock
  private TiffField height;
  @Autowired
  private ApacheImageService imageService;

  private List<TiffField> tiffFields;

  @BeforeEach
  void setUp() {
    tiffFields = List.of(width, height);

    when(width.getTagName()).thenReturn("ExifImageWidth");
    when(height.getTagName()).thenReturn("ExifImageLength");
  }

  @Test
  void shouldGetExifFields_When_ValidFields() {
    // Given
    when(metadata.getExif()).thenReturn(tiffMetadata);
    when(tiffMetadata.getAllFields()).thenReturn(tiffFields);

    // When
    List<TiffField> exifFields = imageService.getExifFields(metadata);

    // Then
    assertAll(
        () -> assertEquals(tiffFields.size(), exifFields.size(), "Fields should have equal size"),
        () -> assertEquals(tiffFields, exifFields, "Fields should be equal")
    );
  }

  @Test
  void shouldGetExifFieldsEmpty_When_MetadataNull() {
    // Given

    // When
    List<TiffField> exifFields = imageService.getExifFields(null);

    // Then
    assertTrue(exifFields.isEmpty(), "Fields should be empty");
  }

  @Test
  void shouldGetExifFieldsEmpty_When_MetadataNotJpeg() {
    // Given
    ImageMetadata customMetadata = new ImageMetadata() {
      @Override
      public List<? extends ImageMetadataItem> getItems() {
        return Collections.emptyList();
      }

      @Override
      public String toString(String s) {
        return "";
      }
    };

    // When
    List<TiffField> exifFields = imageService.getExifFields(customMetadata);

    // Then
    assertTrue(exifFields.isEmpty(), "Fields should be empty");
  }

  @Test
  void shouldGetExifFields_When_EmptyExif() {
    // Given
    when(metadata.getExif()).thenReturn(null);

    // When
    List<TiffField> exifFields = imageService.getExifFields(metadata);

    // Then
    assertTrue(exifFields.isEmpty(), "Fields should be empty");
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldGetExifFields_When_NullOrEmptyFields(List<TiffField> tiffFields) {
    // Given
    when(metadata.getExif()).thenReturn(tiffMetadata);
    when(tiffMetadata.getAllFields()).thenReturn(tiffFields);

    // When
    List<TiffField> exifFields = imageService.getExifFields(metadata);

    // Then
    assertTrue(exifFields.isEmpty(), "Fields should be empty");
  }

  @Test
  void shouldGetMetaSize_When_ValidSizes() throws ImagingException {
    // Given
    when(width.getIntValue()).thenReturn(DIMENSION);
    when(height.getIntValue()).thenReturn(DIMENSION);

    // When
    Optional<ImageSize> imageSizeOptional = imageService.getMetaSize(tiffFields);

    // Then
    assertTrue(imageSizeOptional.isPresent(), "Image size should be present");
    assertAll(
        () -> assertEquals(DIMENSION, imageSizeOptional.get().getWidth(), "Width should be equal"),
        () -> assertEquals(DIMENSION, imageSizeOptional.get().getHeight(), "Height should be equal")
    );
  }

  @Test
  void shouldGetMetaSize_When_TooLittleMetadataFields() throws ImagingException {
    // Given
    List<TiffField> oneField = List.of(width);

    // When
    Optional<ImageSize> imageSizeOptional = imageService.getMetaSize(oneField);

    // Then
    assertFalse(imageSizeOptional.isPresent(), "Image size should not be present");
  }

  @Test
  void shouldGetMetaSize_When_NoWidthField() throws ImagingException {
    // Given
    List<TiffField> oneField = List.of(height, height);

    // When
    Optional<ImageSize> imageSizeOptional = imageService.getMetaSize(oneField);

    // Then
    assertFalse(imageSizeOptional.isPresent(), "Image size should not be present");
  }

  @Test
  void shouldGetMetaSize_When_NoHeightField() throws ImagingException {
    // Given
    List<TiffField> oneField = List.of(width, width);

    // When
    Optional<ImageSize> imageSizeOptional = imageService.getMetaSize(oneField);

    // Then
    assertFalse(imageSizeOptional.isPresent(), "Image size should not be present");
  }
}