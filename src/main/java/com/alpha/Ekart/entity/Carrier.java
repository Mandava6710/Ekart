package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Carrier {
	
	@Id
	private int cid;
	private String cname;
	private String cmail;
	private long contact;
	
	

	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	public String getCname() {
		return cname;
	}

	public void setCname(String cname) {
		this.cname = cname;
	}

	public String getCmail() {
		return cmail;
	}

	public void setCmail(String cmail) {
		this.cmail = cmail;
	}

	public long getContact() {
		return contact;
	}

	public void setContact(long contact) {
		this.contact = contact;
	}

	

	public Carrier(int cid, String cname, String cmail, long contact) {
		super();
		this.cid = cid;
		this.cname = cname;
		this.cmail = cmail;
		this.contact = contact;
	}

	public Carrier() {
		super();
	}
	
	
	
	

}
