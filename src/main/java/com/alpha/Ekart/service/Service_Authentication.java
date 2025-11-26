package com.alpha.Ekart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.dto.UserLoginDto;
import com.alpha.Ekart.dto.UserResponseDto;
import com.alpha.Ekart.entity.Customer;
import com.alpha.Ekart.entity.Admin;
import com.alpha.Ekart.respository.CustomerResp;
import com.alpha.Ekart.respository.AdminResp;

@Service
public class Service_Authentication {
	
	@Autowired
	private CustomerResp cresp;
	
	@Autowired
	private AdminResp aresp;

	public ResponseEntity<ResponseStructure<UserResponseDto>> customerLogin(UserLoginDto loginDto) {
		ResponseStructure<UserResponseDto> rs = new ResponseStructure<UserResponseDto>();
		
		try {
			// Fetch all customers and find matching email/password
			var allCustomers = cresp.findAll();
			Customer customer = allCustomers.stream()
				.filter(c -> c.getMail().equals(loginDto.getMail()) && 
						   c.getPassword().equals(loginDto.getPassword()))
				.findFirst()
				.orElse(null);
			
			if(customer != null) {
				UserResponseDto userResponse = new UserResponseDto(
					customer.getId(),
					customer.getName(),
					customer.getMail(),
					customer.getRole(),
					"CUSTOMER"
				);
				rs.setStatuscode(HttpStatus.OK.value());
				rs.setMessage("Customer login successful");
				rs.setData(userResponse);
			} else {
				rs.setStatuscode(HttpStatus.UNAUTHORIZED.value());
				rs.setMessage("Invalid email or password");
				rs.setData(null);
			}
		} catch (Exception e) {
			rs.setStatuscode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			rs.setMessage("Login failed: " + e.getMessage());
			rs.setData(null);
		}
		
		return new ResponseEntity<ResponseStructure<UserResponseDto>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<UserResponseDto>> adminLogin(UserLoginDto loginDto) {
		ResponseStructure<UserResponseDto> rs = new ResponseStructure<UserResponseDto>();
		
		try {
			// Fetch all admins and find matching email/password
			var allAdmins = aresp.findAll();
			Admin admin = allAdmins.stream()
				.filter(a -> a.getMail().equals(loginDto.getMail()) && 
						   a.getPassword().equals(loginDto.getPassword()))
				.findFirst()
				.orElse(null);
			
			if(admin != null) {
				UserResponseDto userResponse = new UserResponseDto(
					admin.getId(),
					admin.getName(),
					admin.getMail(),
					admin.getRole(),
					"ADMIN"
				);
				rs.setStatuscode(HttpStatus.OK.value());
				rs.setMessage("Admin login successful");
				rs.setData(userResponse);
			} else {
				rs.setStatuscode(HttpStatus.UNAUTHORIZED.value());
				rs.setMessage("Invalid email or password");
				rs.setData(null);
			}
		} catch (Exception e) {
			rs.setStatuscode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			rs.setMessage("Login failed: " + e.getMessage());
			rs.setData(null);
		}
		
		return new ResponseEntity<ResponseStructure<UserResponseDto>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<UserResponseDto>> login(UserLoginDto loginDto) {
		if("CUSTOMER".equalsIgnoreCase(loginDto.getUserType())) {
			return customerLogin(loginDto);
		} else if("ADMIN".equalsIgnoreCase(loginDto.getUserType())) {
			return adminLogin(loginDto);
		} else {
			ResponseStructure<UserResponseDto> rs = new ResponseStructure<UserResponseDto>();
			rs.setStatuscode(HttpStatus.BAD_REQUEST.value());
			rs.setMessage("Invalid user type. Use 'CUSTOMER' or 'ADMIN'");
			rs.setData(null);
			return new ResponseEntity<ResponseStructure<UserResponseDto>>(rs, HttpStatus.OK);
		}
	}
}
