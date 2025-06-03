package com.qentelli.employeetrackingsystem.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.qentelli.employeetrackingsystem.config.JwtUtil;
import com.qentelli.employeetrackingsystem.exception.RequestProcessStatus;
import com.qentelli.employeetrackingsystem.models.client.request.UserDetailsDto;
import com.qentelli.employeetrackingsystem.models.client.response.AuthResponse;
import com.qentelli.employeetrackingsystem.models.client.response.MessageResponse;
import com.qentelli.employeetrackingsystem.models.client.response.UserDto;
import com.qentelli.employeetrackingsystem.serviceImpl.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
 
	
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerByUser(@RequestBody UserDetailsDto userDetailsDto) {
      try {
    	  UserDto userDto = userService.registerNewUser(userDetailsDto);
    	  AuthResponse<UserDto> authResponse = new AuthResponse<UserDto>(HttpStatus.OK.value(), RequestProcessStatus.SUCCESS, LocalDateTime.now(), null, userDto);
    	  return new ResponseEntity<>(authResponse,HttpStatus.OK);
      }catch(ResponseStatusException e) {
    	  return ResponseEntity.status(e.getStatusCode()).body(new MessageResponse(e.getMessage()));
      }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginByUser(@RequestBody UserDetailsDto userDetailsDto) {
    	UserDetailsDto userDetails = userService.loginByEmail(userDetailsDto);
    	AuthResponse<UserDetailsDto> authResponse = new AuthResponse<UserDetailsDto>(HttpStatus.OK.value(), RequestProcessStatus.SUCCESS, LocalDateTime.now(), null, userDetails); 
        return new ResponseEntity<>(authResponse,HttpStatus.OK);
    }

}
