package com.alpha.Ekart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Address;
import com.alpha.Ekart.entity.Driver;
import com.alpha.Ekart.exception.AddressAlreadyPresentException;
import com.alpha.Ekart.exception.AddressNotFoundException;
import com.alpha.Ekart.exception.DriverAlreadyPresentException;
import com.alpha.Ekart.exception.DriverNotFoundException;
import com.alpha.Ekart.respository.AddressResp;

@Service
public class Service_Address {
	
	@Autowired
	private AddressResp aresp;

	public ResponseEntity<ResponseStructure<Address>> saveAddress(Address a) {
		
		Boolean present =aresp.existsById(a.getId());
		
		ResponseStructure<Address> rs= new ResponseStructure<Address>();
		
		if(present) throw new AddressAlreadyPresentException();
		
		aresp.save(a);
		rs.setStatuscode(HttpStatus.CREATED.value());
		rs.setMessage("Address Details Created");
		rs.setData(a);
		
		return new ResponseEntity<ResponseStructure<Address>>(rs,HttpStatus.CREATED);
	}

	public ResponseEntity<ResponseStructure<Address>> findAddress(int id) {
		
		Address a=aresp.findById(id).orElseThrow(()-> new AddressNotFoundException() );
		ResponseStructure<Address> rs= new ResponseStructure<Address>();

			rs.setStatuscode(HttpStatus.FOUND.value());
			rs.setMessage("Address deatails found with ID: "+ id);
		    rs.setData(a);
		
		return new ResponseEntity<ResponseStructure<Address>>(rs,HttpStatus.OK);
	}

}
