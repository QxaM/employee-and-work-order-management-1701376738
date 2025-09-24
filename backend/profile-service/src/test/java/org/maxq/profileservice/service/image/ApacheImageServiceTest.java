package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.ImagingException;
import org.apache.commons.imaging.common.ImageMetadata;
import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.apache.commons.imaging.formats.jpeg.JpegImageMetadata;
import org.apache.commons.imaging.formats.tiff.TiffField;
import org.apache.commons.imaging.formats.tiff.TiffImageMetadata;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.maxq.profileservice.domain.ImageSize;
import org.maxq.profileservice.domain.InMemoryFile;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import javax.imageio.IIOImage;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
  @Mock
  private ImageWriter jpegImageWriter;
  @Autowired
  private ApacheImageService imageService;

  @MockitoBean
  private ImageWriterFactory imageWriterFactory;

  private List<TiffField> tiffFields;

  @BeforeEach
  void setUp() {
    tiffFields = List.of(width, height);

    when(width.getTagName()).thenReturn("ExifImageWidth");
    when(height.getTagName()).thenReturn("ExifImageLength");
    when(imageWriterFactory.createJpegImageWriter()).thenReturn(jpegImageWriter);
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

  @Test
  void shouldResizeImage_When_Downscaling() {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, true);
    int newWidth = 50;
    int newHeight = 50;
    Dimension dimension = new Dimension(newWidth, newHeight);

    // When
    BufferedImage resizedImage = imageService.resizeImage(image, dimension);

    // Then
    assertAll(
        () -> assertEquals(newWidth, resizedImage.getWidth(), "Width should be equal"),
        () -> assertEquals(newHeight, resizedImage.getHeight(), "Height should be equal")
    );
  }

  @Test
  void shouldResizeImage_When_Upscaling() {
    // Given
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, true);
    int newWidth = 200;
    int newHeight = 200;
    Dimension dimension = new Dimension(newWidth, newHeight);

    // When
    BufferedImage resizedImage = imageService.resizeImage(image, dimension);

    // Then
    assertAll(
        () -> assertEquals(newWidth, resizedImage.getWidth(), "Width should be equal"),
        () -> assertEquals(newHeight, resizedImage.getHeight(), "Height should be equal")
    );
  }

  @Test
  void shouldWriteToJpeg_When_WriteCorrect() throws IOException {
    // Given
    int imageWriteParam = ImageWriteParam.MODE_EXPLICIT;
    float compressionQuality = 0.9f;
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, true);

    doCallRealMethod().when(jpegImageWriter).setOutput(any());
    when(jpegImageWriter.getDefaultWriteParam()).thenReturn(new JPEGImageWriteParam(null));

    // When
    InMemoryFile writtenImage = imageService.writeToJpeg(image);

    // Then
    assertEquals("image/jpeg", writtenImage.getContentType(), "Content type should be correct");
    verify(jpegImageWriter, times(1)).setOutput(any());
    verify(jpegImageWriter, times(1))
        .write(
            eq(null),
            any(IIOImage.class),
            argThat(writeParam ->
                writeParam.getCompressionMode() == imageWriteParam
                    && writeParam.getCompressionQuality() == compressionQuality
            )
        );
    verify(jpegImageWriter, times(1)).dispose();
  }

  @Test
  void shouldNotWriteToJpeg_When_writeFailed() throws IOException {
    // Given
    int imageWriteParam = ImageWriteParam.MODE_EXPLICIT;
    float compressionQuality = 0.9f;
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, true);

    doCallRealMethod().when(jpegImageWriter).setOutput(any());
    when(jpegImageWriter.getDefaultWriteParam()).thenReturn(new JPEGImageWriteParam(null));
    doThrow(new IOException("Test exception")).when(jpegImageWriter).write(any(), any(), any());

    // When
    Executable executable = () -> imageService.writeToJpeg(image);

    // Then
    assertThrows(IOException.class, executable, "Exception should be thrown");
    verify(jpegImageWriter, times(1)).setOutput(any());
    verify(jpegImageWriter, times(1))
        .write(
            eq(null),
            any(IIOImage.class),
            argThat(writeParam ->
                writeParam.getCompressionMode() == imageWriteParam
                    && writeParam.getCompressionQuality() == compressionQuality
            )
        );
    verify(jpegImageWriter, times(1)).dispose();
  }
}