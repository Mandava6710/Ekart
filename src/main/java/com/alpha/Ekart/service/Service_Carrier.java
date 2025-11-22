package com.alpha.Ekart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Carrier;
import com.alpha.Ekart.exception.CarrierNotFoundException;
import com.alpha.Ekart.respository.CarrierResp;

@Service
public class Service_Carrier {
	
	@Autowired
	private CarrierResp cresp;

	public ResponseEntity<ResponseStructure<Carrier>> saveCarrierData(Carrier c) {
		int id=c.getCid();
		ResponseStructure<Carrier> rs= new ResponseStructure<Carrier>();
		
		if(cresp.existsById(id)) {	
			rs.setStatuscode(HttpStatus.CONFLICT.value());
			rs.setMessage("Carrier already exists with ID: "+ c.getCid());
		    rs.setData(null);	
		}
		else {
			Carrier savecarrer= cresp.save(c);
	        rs.setStatuscode(HttpStatus.CREATED.value());
	        rs.setMessage("Carrier saved successfully");
	        rs.setData(savecarrer);
		}
		
		return new ResponseEntity<ResponseStructure<Carrier>>(rs,HttpStatus.OK);
		
	}

	public ResponseEntity<ResponseStructure<Carrier>> findCarrier(int id) {
		
		Carrier c=cresp.findById(id).orElseThrow(()-> new CarrierNotFoundException() );
		ResponseStructure<Carrier> rs= new ResponseStructure<Carrier>();

			rs.setStatuscode(HttpStatus.FOUND.value());
			rs.setMessage("Carrier deatails found with ID: "+ id);
		    rs.setData(c);
		
		return new ResponseEntity<ResponseStructure<Carrier>>(rs,HttpStatus.OK);
		
	}

	public void updateCarrier(Carrier c) {
		
		
		
	}
	
	
	

}
