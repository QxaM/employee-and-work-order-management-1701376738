package org.maxq.authorization;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Slf4j
@Getter
class AuthorizationServiceApplicationTests {

  @Autowired
  private DataSource dataSource;

  @Test
  void contextLoads() {
    // Explicitly empty - just test Spring configuration
    assertTrue(true, "Intentionally empty");
  }

  @Test
  void shouldConnectToJDB() {
    // Given
    String connectionString = "jdbc:h2:mem:testdb";
    String url = null;

    // When
    try (Connection connection = dataSource.getConnection()) {
      DatabaseMetaData metaData = connection.getMetaData();
      log.info("Connected to: {}", metaData.getURL());
      url = metaData.getURL();
    } catch (SQLException e) {
      if (log.isErrorEnabled()) {
        log.error(e.getMessage());
      }
    }

    // Then
    assertEquals(connectionString, url, "Tests are not connected to internal H2 database");
  }

}
