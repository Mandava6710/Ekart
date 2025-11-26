package com.alpha.Ekart.dto;


public class OrderDto {
	private int cargoid;
	private String cargoname;
	private String cargodescription;
	private double cargoweight;
	private int cargocount;
	private int addressid;
	private int unaddressid;
	private int customerid;
	
	public int getCustomerid() {
		return customerid;
	}
	public void setCustomerid(int customerid) {
		this.customerid = customerid;
	}
	
	public int getCargoid() {
		return cargoid;
	}
	public void setCargoid(int cargoid) {
		this.cargoid = cargoid;
	}
	public String getCargoname() {
		return cargoname;
	}
	public void setCargoname(String cargoname) {
		this.cargoname = cargoname;
	}
	public String getCargodescription() {
		return cargodescription;
	}
	public void setCargodescription(String cargodescription) {
		this.cargodescription = cargodescription;
	}
	public double getCargoweight() {
		return cargoweight;
	}
	public void setCargoweight(double cargoweight) {
		this.cargoweight = cargoweight;
	}
	public int getCargocount() {
		return cargocount;
	}
	public void setCargocount(int cargocount) {
		this.cargocount = cargocount;
	}
	public int getAddressid() {
		return addressid;
	}
	public void setAddressid(int addressid) {
		this.addressid = addressid;
	}
	public int getUnaddressid() {
		return unaddressid;
	}
	public void setUnaddressid(int unaddressid) {
		this.unaddressid = unaddressid;
	}
	
	
	
	

}