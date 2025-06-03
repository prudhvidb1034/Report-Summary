package com.qentelli.employeetrackingsystem.models.client.request;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UserDetailsDto {
	private int id;
	private String firstName;
	private String lastName;
	private int employeeId;
	private String email;
	private String password;
	private String coniformPassord;
	private Set<String> roles;
	private String acessToken;

}
