package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class Truck {

	@Id
	private int tid;
	private String tname;
	private String tnumber;
	private int tcapacity;
	private String tstatus;
	@OneToOne
	private Carrier carrier_id;

	public int getTid() {
		return tid;
	}

	public void setTid(int tid) {
		this.tid = tid;
	}

	public String getTname() {
		return tname;
	}

	public void setTname(String tname) {
		this.tname = tname;
	}

	public String getTnumber() {
		return tnumber;
	}

	public void setTnumber(String tnumber) {
		this.tnumber = tnumber;
	}

	public int getTcapacity() {
		return tcapacity;
	}

	public void setTcapacity(int tcapacity) {
		this.tcapacity = tcapacity;
	}

	public String getTstatus() {
		return tstatus;
	}

	public void setTstatus(String tstatus) {
		this.tstatus = tstatus;
	}

	public Carrier getCarrier_id() {
		return carrier_id;
	}

	public void setCarrier_id(Carrier carrier_id) {
		this.carrier_id = carrier_id;
	}

	
	
	public Truck(int tid, String tname, String tnumber, int  tcapacity, String tstatus, Carrier carrier_id) {
		super();
		this.tid = tid;
		this.tname = tname;
		this.tnumber = tnumber;
		this.tcapacity = tcapacity;
		this.tstatus = tstatus;
		this.carrier_id = carrier_id;
	}

	public Truck() {
		super();
	}

}
