package com.qentelli.employeetrackingsystem.models.client.response;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
	
	private String firstName;
	private String lastName;
	private int employeeId;
	private String email;
    private String accessToken;	
//	private Set<String> roles;

}
