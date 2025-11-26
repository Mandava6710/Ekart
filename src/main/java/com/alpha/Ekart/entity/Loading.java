package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Loading {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int lid;
	private String ldate;
	private String ltime;
	@ManyToOne(fetch = FetchType.EAGER)
	private Address address_id;
	public int getLid() {
		return lid;
	}
	public int getId() {
		return lid;  // Alias for frontend compatibility
	}
	public void setLid(int lid) {
		this.lid = lid;
	}
	public String getLdate() {
		return ldate;
	}
	public void setLdate(String ldate) {
		this.ldate = ldate;
	}
	public String getLtime() {
		return ltime;
	}
	public void setLtime(String ltime) {
		this.ltime = ltime;
	}
	public Address getAddress_id() {
		return address_id;
	}
	public void setAddress_id(Address address_id) {
		this.address_id = address_id;
	}
	public Loading(int lid, String ldate, String ltime, Address address_id) {
		super();
		this.lid = lid;
		this.ldate = ldate;
		this.ltime = ltime;
		this.address_id = address_id;
	}
	public Loading() {
		super();
	}
	
	

}
