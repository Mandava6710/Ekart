package com.alpha.Ekart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Customer;
import com.alpha.Ekart.exception.CustomerAlreadyPresentException;
import com.alpha.Ekart.exception.CustomerNotFoundException;
import com.alpha.Ekart.respository.CustomerResp;

@Service
public class Service_Customer {
	
	@Autowired
	private CustomerResp cresp;

	public ResponseEntity<ResponseStructure<Customer>> saveCustomerData(Customer c) {
		int id = c.getId();
		ResponseStructure<Customer> rs = new ResponseStructure<Customer>();
		
		if(cresp.existsById(id)) {	
			rs.setStatuscode(HttpStatus.CONFLICT.value());
			rs.setMessage("Customer already exists with ID: "+ c.getId());
		    rs.setData(null);	
		}
		else {
			Customer saveCustomer = cresp.save(c);
	        rs.setStatuscode(HttpStatus.CREATED.value());
	        rs.setMessage("Customer saved successfully");
	        rs.setData(saveCustomer);
		}
		
		return new ResponseEntity<ResponseStructure<Customer>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<Customer>> findCustomer(int id) {
		Customer c = cresp.findById(id).orElseThrow(() -> new CustomerNotFoundException());
		ResponseStructure<Customer> rs = new ResponseStructure<Customer>();

		rs.setStatuscode(HttpStatus.FOUND.value());
		rs.setMessage("Customer details found with ID: "+ id);
	    rs.setData(c);
		
		return new ResponseEntity<ResponseStructure<Customer>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<Customer>>> getAllCustomers() {
		List<Customer> customers = cresp.findAll();
		ResponseStructure<List<Customer>> rs = new ResponseStructure<List<Customer>>();
		
		if(customers.isEmpty()) {
			rs.setStatuscode(HttpStatus.NOT_FOUND.value());
			rs.setMessage("No customers found");
			rs.setData(null);
		} else {
			rs.setStatuscode(HttpStatus.FOUND.value());
			rs.setMessage("Customers retrieved successfully");
			rs.setData(customers);
		}
		
		return new ResponseEntity<ResponseStructure<List<Customer>>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<Customer>> updateCustomer(Customer c) {
		int id = c.getId();
		ResponseStructure<Customer> rs = new ResponseStructure<Customer>();
		
		if(cresp.existsById(id)) {
			Customer updatedCustomer = cresp.save(c);
			rs.setStatuscode(HttpStatus.OK.value());
			rs.setMessage("Customer updated successfully");
			rs.setData(updatedCustomer);
		} else {
			rs.setStatuscode(HttpStatus.NOT_FOUND.value());
			rs.setMessage("Customer not found with ID: "+ id);
			rs.setData(null);
		}
		
		return new ResponseEntity<ResponseStructure<Customer>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<String>> deleteCustomer(int id) {
		ResponseStructure<String> rs = new ResponseStructure<String>();
		
		if(cresp.existsById(id)) {
			cresp.deleteById(id);
			rs.setStatuscode(HttpStatus.OK.value());
			rs.setMessage("Customer deleted successfully");
			rs.setData(null);
		} else {
			rs.setStatuscode(HttpStatus.NOT_FOUND.value());
			rs.setMessage("Customer not found with ID: "+ id);
			rs.setData(null);
		}
		
		return new ResponseEntity<ResponseStructure<String>>(rs, HttpStatus.OK);
	}
}
