package org.maxq.profileservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "PROFILE_IMAGES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ProfileImage {

  @Id
  @GeneratedValue(generator = "profile_image_seq")
  @SequenceGenerator(name = "profile_image_seq", sequenceName = "PROFILE_IMAGE_SEQ", allocationSize = 1)
  private Long id;

  private String name;

  private String contentType;

  private long size;

  @CreationTimestamp
  private LocalDateTime timestamp;

  public ProfileImage(String name, String contentType, long size) {
    this.name = name;
    this.contentType = contentType;
    this.size = size;
  }
}
