package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class UnLoading {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int unlid;
	private String unldate;
	private String unltime;
	@ManyToOne
	private Address address_id;
	public int getUnlid() {
		return unlid;
	}
	public void setUnlid(int unlid) {
		this.unlid = unlid;
	}
	public String getUnldate() {
		return unldate;
	}
	public void setUnldate(String unldate) {
		this.unldate = unldate;
	}
	public String getUnltime() {
		return unltime;
	}
	public void setUnltime(String unltime) {
		this.unltime = unltime;
	}
	public Address getAddress_id() {
		return address_id;
	}
	public void setAddress_id(Address address_id) {
		this.address_id = address_id;
	}

	
	public UnLoading(int unlid, String unldate, String unltime, Address address_id) {
		super();
		this.unlid = unlid;
		this.unldate = unldate;
		this.unltime = unltime;
		this.address_id = address_id;
	}
	public UnLoading() {
		super();
	}

	
	
}
