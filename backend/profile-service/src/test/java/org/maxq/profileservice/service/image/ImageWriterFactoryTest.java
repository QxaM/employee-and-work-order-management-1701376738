package org.maxq.profileservice.service.image;

import org.apache.commons.imaging.common.SimpleBufferedImageFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ImageWriterFactoryTest {

  @Autowired
  private ImageWriterFactory factory;

  @Test
  void shouldCreateJpegImageWriter() {
    // Given

    // When
    ImageWriter imageWriter = factory.createJpegImageWriter();

    // Then
    assertNotNull(imageWriter, "Image writer not created");
    assertTrue(imageWriter.getClass().getSimpleName().contains("JPEGImageWriter"),
        "Wrong image writer created");
  }

  @Test
  void shouldAllowToDisposeJpegImageWriter() throws IOException {
    // Given
    byte[] imageData;
    BufferedImage image = new SimpleBufferedImageFactory().getColorBufferedImage(100, 100, false);
    Graphics g = image.getGraphics();
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, 100, 100);
    g.dispose();

    // When
    ImageWriter imageWriter = factory.createJpegImageWriter();
    imageWriter.dispose();

    ImageWriter newWriter = factory.createJpegImageWriter();

    try (ByteArrayOutputStream os = new ByteArrayOutputStream();
         ImageOutputStream ios = ImageIO.createImageOutputStream(os)) {
      newWriter.setOutput(ios);

      IIOImage newImage = new IIOImage(image, null, null);

      newWriter.write(null, newImage, null);
      imageData = os.toByteArray();
    } finally {
      newWriter.dispose();
    }

    // Then
    assertNotNull(imageData, "Image data not created");
    assertTrue(imageData.length > 0, "Image data is empty");
  }
}