package org.maxq.profileservice.repository;

import org.maxq.profileservice.domain.ProfileImage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileImageRepository extends CrudRepository<ProfileImage, Long> {
}
