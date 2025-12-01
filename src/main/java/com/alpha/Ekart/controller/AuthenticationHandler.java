package com.alpha.Ekart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.dto.UserLoginDto;
import com.alpha.Ekart.dto.UserResponseDto;
import com.alpha.Ekart.service.Service_Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationHandler {
	
	@Autowired
	private Service_Authentication authService;
	
	@PostMapping("/login")
	public ResponseEntity<ResponseStructure<UserResponseDto>> login(@RequestBody UserLoginDto loginDto) {
		return authService.login(loginDto);
	}
	
	@PostMapping("/customer-login")
	public ResponseEntity<ResponseStructure<UserResponseDto>> customerLogin(@RequestBody UserLoginDto loginDto) {
		return authService.customerLogin(loginDto);
	}
	
	@PostMapping("/admin-login")
	public ResponseEntity<ResponseStructure<UserResponseDto>> adminLogin(@RequestBody UserLoginDto loginDto) {
		return authService.adminLogin(loginDto);
	}
	
}
