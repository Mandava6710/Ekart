package com.alpha.Ekart.dto;

public class UserResponseDto {
	
	private int id;
	private String name;
	private String mail;
	private String role;
	private String userType;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getMail() {
		return mail;
	}
	
	public void setMail(String mail) {
		this.mail = mail;
	}
	
	public String getRole() {
		return role;
	}
	
	public void setRole(String role) {
		this.role = role;
	}
	
	public String getUserType() {
		return userType;
	}
	
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	public UserResponseDto(int id, String name, String mail, String role, String userType) {
		super();
		this.id = id;
		this.name = name;
		this.mail = mail;
		this.role = role;
		this.userType = userType;
	}
	
	public UserResponseDto() {
		super();
	}
	
}
