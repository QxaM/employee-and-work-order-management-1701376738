package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.ImagingException;
import org.apache.commons.imaging.common.ImageMetadata;
import org.apache.commons.imaging.formats.jpeg.JpegImageMetadata;
import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.jpeg.iptc.JpegIptcRewriter;
import org.apache.commons.imaging.formats.jpeg.xmp.JpegXmpRewriter;
import org.apache.commons.imaging.formats.tiff.TiffField;
import org.apache.commons.imaging.formats.tiff.TiffImageMetadata;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.maxq.profileservice.domain.ImageSize;
import org.maxq.profileservice.domain.InMemoryFile;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ApacheImageServiceTest {

  private static final int MAX_RESIZE_DIMENSION = 1024;
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

  @MockitoBean
  private ExifRewriter exifWriter;
  @MockitoBean
  private JpegXmpRewriter xmpWriter;
  @MockitoBean
  private JpegIptcRewriter iptcWriter;

  private List<TiffField> tiffFields;

  private static Stream<DimensionHelper> invalidImageDimensions() {
    return Stream.of(
        new DimensionHelper(
            new Dimension(1025, MAX_RESIZE_DIMENSION),
            new Dimension(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION)
        ),
        new DimensionHelper(
            new Dimension(MAX_RESIZE_DIMENSION, 1025),
            new Dimension(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION)
        ),
        new DimensionHelper(
            new Dimension(2 * MAX_RESIZE_DIMENSION, 1025),
            new Dimension(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION)
        )
    );
  }

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

  @Test
  void shouldStrip_When_JpegFile() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/jpeg");
    doNothing().when(exifWriter).removeExifMetadata(any(byte[].class), any(ByteArrayOutputStream.class));
    doNothing().when(xmpWriter).removeXmpXml(any(byte[].class), any(ByteArrayOutputStream.class));
    doNothing().when(iptcWriter)
        .removeIptc(any(byte[].class), any(ByteArrayOutputStream.class), anyBoolean());

    // When
    InMemoryFile strippedFile = imageService.stripMetadata(file);

    // Then
    verify(exifWriter, times(1))
        .removeExifMetadata(eq(file.getData()), any(ByteArrayOutputStream.class));
    verify(xmpWriter, times(1))
        .removeXmpXml(any(byte[].class), any(ByteArrayOutputStream.class));
    verify(iptcWriter, times(1))
        .removeIptc(any(byte[].class), any(ByteArrayOutputStream.class), eq(true));
    assertNotEquals(file, strippedFile, "New file should be created");
  }

  @Test
  void shouldNotStrip_When_PngFile() throws IOException {
    // Given
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");

    // When
    InMemoryFile strippedFile = imageService.stripMetadata(file);

    // Then
    assertEquals(file, strippedFile, "Original file should be returned");
  }

  @Test
  void shouldCalculateDimension_For_SmallerImages() {
    // Given
    int smallerWidth = 100;
    int smallerHeight = 100;
    int maxWidth = 1024;
    int maxHeight = 1024;

    // When
    Dimension newDimension
        = imageService.calculateDimension(smallerWidth, smallerHeight, maxWidth, maxHeight);

    // Then
    assertAll(
        () -> assertEquals(smallerWidth, newDimension.width, "Width should be equal"),
        () -> assertEquals(smallerHeight, newDimension.height, "Height should be equal")
    );
  }

  @ParameterizedTest
  @MethodSource("invalidImageDimensions")
  void shouldCalculateDimension_For_BiggerImages(DimensionHelper dimensionHelper) {
    // Given
    double expectedRatio = Math.min(dimensionHelper.widthRatio, dimensionHelper.heightRatio);
    int expectedWidth = (int) (dimensionHelper.inputDimension.width * expectedRatio);
    int expectedHeight = (int) (dimensionHelper.inputDimension.height * expectedRatio);

    int biggerWidth = dimensionHelper.inputDimension.width;
    int biggerHeight = dimensionHelper.inputDimension.height;
    int maxWidth = dimensionHelper.maxDimension.width;
    int maxHeight = dimensionHelper.maxDimension.height;

    // When
    Dimension newDimension
        = imageService.calculateDimension(biggerWidth, biggerHeight, maxWidth, maxHeight);

    // Then
    assertAll(
        () -> assertEquals(expectedWidth, newDimension.width, "Width should be equal"),
        () -> assertEquals(expectedHeight, newDimension.height, "Height should be equal")
    );
  }

  @Test
  void shouldResizeImage() throws IOException {
    // Given
    ApacheImageService spyService = spy(imageService);
    BufferedImage mockImage = mock(BufferedImage.class);
    InMemoryFile file = InMemoryFile.create("test".getBytes(), "image/png");
    int imageDimension = 2 * MAX_RESIZE_DIMENSION;

    doReturn(mockImage).when(spyService).getBufferedImage(file);
    when(mockImage.getWidth()).thenReturn(imageDimension);
    when(mockImage.getHeight()).thenReturn(imageDimension);
    when(mockImage.getType()).thenReturn(BufferedImage.TYPE_INT_RGB);

    // When
    BufferedImage newImage = spyService.resizeImage(file);

    // Then
    assertAll(
        () -> assertEquals(MAX_RESIZE_DIMENSION, newImage.getWidth(),
            "Image should be correctly resized"),
        () -> assertEquals(MAX_RESIZE_DIMENSION, newImage.getHeight(),
            "Image should be correctly resized")
    );
    verify(spyService, times(1)).calculateDimension(
        imageDimension, imageDimension,
        MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION
    );
  }

  private static final class DimensionHelper {
    private final Dimension inputDimension;
    private final Dimension maxDimension;
    private final double widthRatio;
    private final double heightRatio;

    private DimensionHelper(Dimension inputDimension, Dimension maxDimension) {
      this.inputDimension = inputDimension;
      this.maxDimension = maxDimension;
      this.widthRatio = (double) maxDimension.width / inputDimension.width;
      this.heightRatio = (double) maxDimension.height / inputDimension.height;
    }
  }
}