package org.maxq.profileservice.config.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

  @Value("${aws.s3.profile-images.access-key}")
  private String accessKey;
  @Value("${aws.s3.profile-images.access-secret}")
  private String secretKey;
  @Value("${aws.s3.profile-images.region}")
  private String region;

  @Bean
  public S3Client profileImageUploadClient() {
    AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);
    StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(awsCredentials);
    return S3Client.builder()
        .credentialsProvider(credentialsProvider)
        .region(Region.of(region))
        .build();
  }
}
