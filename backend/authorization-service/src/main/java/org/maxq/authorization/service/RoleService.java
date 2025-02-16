package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.exception.DuplicateRoleException;
import org.maxq.authorization.repository.RoleRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

  private final RoleRepository roleRepository;

  public void createRole(String roleName) throws DuplicateRoleException {
    try {
      roleRepository.save(new Role(roleName));
    } catch (DataIntegrityViolationException e) {
      throw new DuplicateRoleException(
          "Provided role already exists: " + roleName, e);
    }
  }
}
