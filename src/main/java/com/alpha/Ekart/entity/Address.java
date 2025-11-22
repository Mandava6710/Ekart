package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Address {
	
	@Id
	private int id;
	private String street;
	private String city;
	private int pincode;
	private String state;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public int getPincode() {
		return pincode;
	}
	public void setPincode(int pincode) {
		this.pincode = pincode;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public Address(int id, String street, String city, int pincode, String state) {
		super();
		this.id = id;
		this.street = street;
		this.city = city;
		this.pincode = pincode;
		this.state = state;
	}
	public Address() {
		super();
	}
	
	
	
	
	
	

}
