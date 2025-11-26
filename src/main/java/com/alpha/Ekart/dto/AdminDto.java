package com.alpha.Ekart.dto;

public class AdminDto {
	
	private int id;
	private String name;
	private String mail;
	private String password;
	private String role;
	
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
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getRole() {
		return role;
	}
	
	public void setRole(String role) {
		this.role = role;
	}
	
	public AdminDto(int id, String name, String mail, String password, String role) {
		super();
		this.id = id;
		this.name = name;
		this.mail = mail;
		this.password = password;
		this.role = role;
	}
	
	public AdminDto() {
		super();
	}
	
}
