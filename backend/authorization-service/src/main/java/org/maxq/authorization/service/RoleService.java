package org.maxq.authorization.service;

import lombok.RequiredArgsConstructor;
import org.maxq.authorization.domain.Role;
import org.maxq.authorization.domain.exception.DuplicateRoleException;
import org.maxq.authorization.domain.exception.ElementNotFoundException;
import org.maxq.authorization.repository.RoleRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

  public Role findByName(String roleName) throws ElementNotFoundException {
    Optional<Role> foundRole = roleRepository.findByName(roleName);
    return foundRole.orElseThrow(() ->
        new ElementNotFoundException("Role with name '" + roleName + "' does not exist"));
  }

  public List<Role> getAllRoles() {
    return roleRepository.findAll();
  }
}
