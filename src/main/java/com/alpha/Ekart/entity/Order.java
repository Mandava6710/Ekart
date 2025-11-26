package com.alpha.Ekart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name="userorder")
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String orderdate;
	private String status="placedOrder";
	private double cost;
	@ManyToOne(fetch = FetchType.EAGER)
	private Customer customer;
	@ManyToOne(fetch = FetchType.EAGER)
	private Truck truck;
	@ManyToOne(fetch = FetchType.EAGER)
	private Carrier carrier;
	@ManyToOne(fetch = FetchType.EAGER)
	private Cargo cargo;
	@OneToOne(fetch = FetchType.EAGER)
	private Loading loading;
	@OneToOne(fetch = FetchType.EAGER)
	private UnLoading unloading;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getOrderdate() {
		return orderdate;
	}
	public void setOrderdate(String orderdate) {
		this.orderdate = orderdate;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public double getCost() {
		return cost;
	}
	public void setCost(double cost) {
		this.cost = cost;
	}
	public Customer getCustomer() {
		return customer;
	}
	public void setCustomer(Customer customer) {
		this.customer = customer;
	}
	public Carrier getCarrier() {
		return carrier;
	}
	public void setCarrier(Carrier carrier) {
		this.carrier = carrier;
	}
	public Cargo getCargo() {
		return cargo;
	}
	public void setCargo(Cargo cargo) {
		this.cargo = cargo;
	}
	public Truck getTruck() {
		return truck;
	}
	public void setTruck(Truck truck) {
		this.truck = truck;
	}
	public Loading getLoading() {
		return loading;
	}
	public void setLoading(Loading loading) {
		this.loading = loading;
	}
	public UnLoading getUnloading() {
		return unloading;
	}
	public void setUnloading(UnLoading unloading) {
		this.unloading = unloading;
	}
	public Order(int id, String orderdate, String status, double cost, Customer customer, Truck truck, Carrier carrier, Cargo cargo, Loading loading,
			UnLoading unloading) {
		super();
		this.id = id;
		this.orderdate = orderdate;
		this.status = status;
		this.cost = cost;
		this.customer = customer;
		this.truck = truck;
		this.carrier = carrier;
		this.cargo = cargo;
		this.loading = loading;
		this.unloading = unloading;
	}
	public Order() {
		super();
	}
	
	
	
	
	

}
