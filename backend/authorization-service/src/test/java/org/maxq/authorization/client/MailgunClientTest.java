package org.maxq.authorization.client;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import com.google.gson.Gson;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.maxq.authorization.domain.dto.MailgunResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@WireMockTest(httpPort = 8079)
@TestPropertySource(
    properties = {
        "mailgun.url=http://localhost:8079",
        "mailgun.username=api",
        "mailgun.api-token=token"
    },
    inheritProperties = false
)
@ActiveProfiles("QA")
class MailgunClientTest {

  private static final String FROM = "no-reply@maxq.com";

  @Autowired
  private MailgunClient mailgunClient;

  @BeforeEach
  void setUp() {
    stubFor(WireMock.request(HttpMethod.POST.name(), WireMock.urlEqualTo("/messages"))
        .willReturn(WireMock.ok()));
  }

  @Test
  void shouldCallUpstreamService() {
    // Given
    Map<String, String> params = Map.of("from", FROM);

    // When
    mailgunClient.postEmail(params);

    // Then
    verify(1, WireMock.postRequestedFor(WireMock.urlEqualTo("/messages")));
  }

  @Test
  void shouldAddBasicAuthentication() {
    // Given
    Map<String, String> params = Map.of("from", FROM);

    // When
    mailgunClient.postEmail(params);

    // Then
    verify(1, WireMock.postRequestedFor(WireMock.urlEqualTo("/messages"))
        .withHeader(HttpHeaders.AUTHORIZATION, WireMock.containing("Basic ")));
  }

  @Test
  void shouldForwardFormData() {
    // Given
    Map<String, String> params = Map.of("from", FROM);

    // When
    mailgunClient.postEmail(params);

    // Then
    verify(1, WireMock.postRequestedFor(WireMock.urlEqualTo("/messages"))
        .withRequestBodyPart(
            WireMock.aMultipart().withName("from").withBody(WireMock.equalTo(FROM)).build()));
  }

  @Test
  void shouldReturnResponse() {
    // Given
    Gson gson = new Gson();
    MailgunResponseDto responseDto = new MailgunResponseDto(
        "12345",
        "Test message"
    );
    stubFor(WireMock.request(HttpMethod.POST.name(), WireMock.urlEqualTo("/messages"))
        .willReturn(
            WireMock.ok(gson.toJson(responseDto))
                .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        )
    );

    Map<String, String> params = Map.of("from", FROM);

    // When
    MailgunResponseDto actualResponse = mailgunClient.postEmail(params);

    // Then
    assertAll(
        () -> assertEquals(responseDto.getId(), actualResponse.getId()),
        () -> assertEquals(responseDto.getMessage(), actualResponse.getMessage())
    );
  }

}