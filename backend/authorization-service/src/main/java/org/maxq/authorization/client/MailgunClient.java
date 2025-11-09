package org.maxq.authorization.client;

import org.maxq.authorization.config.client.MailgunClientConfig;
import org.maxq.authorization.domain.dto.MailgunResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(value = "mailgun", url = "${mailgun.url}", configuration = MailgunClientConfig.class)
public interface MailgunClient {

  @PostMapping(value = "/messages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  MailgunResponseDto postEmail(@RequestBody Map<String, ?> parts);
}
