package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class Driver {
	
	@Id
	private int did;
	private String dname;
	private long dcontact;
	@OneToOne
	private Truck truck_id;
	@OneToOne
	private Carrier carrier_id;
	

	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	public String getDname() {
		return dname;
	}

	public void setDname(String dname) {
		this.dname = dname;
	}

	public long getDcontact() {
		return dcontact;
	}

	public void setDcontact(long dcontact) {
		this.dcontact = dcontact;
	}

	public Truck getTruck_id() {
		return truck_id;
	}

	public void setTruck_id(Truck truck_id) {
		this.truck_id = truck_id;
	}

	public Carrier getCarrier_id() {
		return carrier_id;
	}

	public void setCarrier_id(Carrier carrier_id) {
		this.carrier_id = carrier_id;
	}

	public Driver(int did, String dname, long dcontact, Truck truck_id, Carrier carrier_id) {
		super();
		this.did = did;
		this.dname = dname;
		this.dcontact = dcontact;
		this.truck_id = truck_id;
		this.carrier_id = carrier_id;
	}

	public Driver() {
		super();
	}
	
	
	
	
	
	
	

}
