package com.qentelli.employeetrackingsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Roles {
	
	@Id
	private String name; // e.g. EMPLOYEE,MANAGER,SUPER_ADMIN

}
