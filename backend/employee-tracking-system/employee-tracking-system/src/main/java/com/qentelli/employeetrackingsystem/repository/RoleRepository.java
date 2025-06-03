package com.qentelli.employeetrackingsystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qentelli.employeetrackingsystem.entity.Roles;

@Repository
public interface RoleRepository extends JpaRepository<Roles, String> {

//	Optional<Roles> findBy(String email);
	Optional<Roles> findByName(String name);
}
