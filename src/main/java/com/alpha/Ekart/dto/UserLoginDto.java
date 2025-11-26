package com.alpha.Ekart.dto;

public class UserLoginDto {
	
	private String mail;
	private String password;
	private String userType;
	
	public String getMail() {
		return mail;
	}
	
	public void setMail(String mail) {
		this.mail = mail;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getUserType() {
		return userType;
	}
	
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	public UserLoginDto(String mail, String password, String userType) {
		super();
		this.mail = mail;
		this.password = password;
		this.userType = userType;
	}
	
	public UserLoginDto() {
		super();
	}
	
}
