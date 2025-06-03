package com.qentelli.employeetrackingsystem.serviceImpl;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.qentelli.employeetrackingsystem.config.JwtUtil;
import com.qentelli.employeetrackingsystem.entity.Roles;
import com.qentelli.employeetrackingsystem.entity.User;
import com.qentelli.employeetrackingsystem.exception.InvalidInputDataException;
import com.qentelli.employeetrackingsystem.models.client.request.UserDetailsDto;
import com.qentelli.employeetrackingsystem.models.client.response.UserDto;
import com.qentelli.employeetrackingsystem.repository.RoleRepository;
import com.qentelli.employeetrackingsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtil jwtUtil;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
	}
	
	// Registration method
	public UserDto registerNewUser(UserDetailsDto userDetailsDto) {
		Optional<User> uesrExist = userRepository.findByEmail(userDetailsDto.getEmail());
		if (uesrExist.isPresent()) {
			throw new InvalidInputDataException(HttpStatus.CONFLICT,
					"Provided user alreday registered. Please logint to continue");
		}

		if (!userDetailsDto.getPassword().equals(userDetailsDto.getConiformPassord())) {
			throw new InvalidInputDataException(HttpStatus.BAD_REQUEST, "Password and Confirm Password do not match!");
		}

		// creating user account
		User user = new User(userDetailsDto.getFirstName(), userDetailsDto.getLastName(),
				userDetailsDto.getEmployeeId(), userDetailsDto.getEmail(),
				passwordEncoder.encode(userDetailsDto.getPassword()));

		Set<String> strRoles = userDetailsDto.getRoles();
		Set<Roles> roles = new HashSet<>();

		if (strRoles == null || strRoles.isEmpty()) {
			Roles userRole = roleRepository.findByName("USER")
					.orElseThrow(() -> new RuntimeException("Default role USER not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(roleName -> {
				Roles role = roleRepository.findByName(roleName.toUpperCase())
						.orElseThrow(() -> new RuntimeException("Role not found " + roleName));
				roles.add(role);
			});
		}
		user.setRoles(roles);
		userRepository.save(user);
		UserDto userDto = new UserDto();
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setEmployeeId(user.getEmployeeId());
		userDto.setEmail(user.getEmail());
		return userDto;
	}

	public UserDetailsDto loginByEmail(UserDetailsDto userDetailsDto) {
		try {
			String email = userDetailsDto.getEmail();
			String password = userDetailsDto.getPassword();
			// 1. Authenticate
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(email, password));
			// 2. Set authenticated user in the context
			SecurityContextHolder.getContext().setAuthentication(authentication);
			// 3. Get authenticated User object
			User user = (User) authentication.getPrincipal();
			// 4. Generate JWT token
			String accessToken = jwtUtil.generateToken(email);

			// 5. Prepare and return DTO (customize as needed)
			UserDetailsDto userDetails = new UserDetailsDto();
			userDetails.setFirstName(user.getFirstName());
			userDetails.setLastName(user.getLastName());

			// password check
			user = userRepository.findByEmail(email)
					.orElseThrow(() -> new UsernameNotFoundException("User not found wih email " + email));
			if (!passwordEncoder.matches(password, user.getPassword())) {
				throw new BadCredentialsException("Invalid user email or password");
			}
			userDetails.setEmployeeId(user.getEmployeeId());
			userDetails.setEmail(email);
			userDetails.setAcessToken(accessToken);
			return userDetails;
		} catch (AuthenticationException e) {
			throw new BadCredentialsException("Invalid user email or password");
		}
	}

}
