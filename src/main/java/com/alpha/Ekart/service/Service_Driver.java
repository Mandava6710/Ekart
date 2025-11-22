package com.alpha.Ekart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Address;
import com.alpha.Ekart.entity.Carrier;
import com.alpha.Ekart.entity.Driver;
import com.alpha.Ekart.entity.Truck;
import com.alpha.Ekart.exception.CarrierNotFoundException;
import com.alpha.Ekart.exception.DriverAlreadyPresentException;
import com.alpha.Ekart.exception.DriverNotFoundException;
import com.alpha.Ekart.exception.TruckAlreadyPresentException;
import com.alpha.Ekart.exception.TruckNotFoundException;
import com.alpha.Ekart.respository.CarrierResp;
import com.alpha.Ekart.respository.DriverResp;
import com.alpha.Ekart.respository.TruckResp;

@Service
public class Service_Driver {
	
	@Autowired
	private DriverResp dresp;

	public ResponseEntity<ResponseStructure<Driver>> saveDriver(Driver d) {
		
		Boolean present =dresp.existsById(d.getDid());
		
		ResponseStructure<Driver> rs= new ResponseStructure<Driver>();
		
		if(present) throw new DriverAlreadyPresentException();
		
		dresp.save(d);
		rs.setStatuscode(HttpStatus.CREATED.value());
		rs.setMessage("Truck Details Created");
		rs.setData(d);
		
		return new ResponseEntity<ResponseStructure<Driver>>(rs,HttpStatus.CREATED);
		
	}

	public ResponseEntity<ResponseStructure<Driver>> findDriver(int id) {
		
		Driver d=dresp.findById(id).orElseThrow(()-> new DriverNotFoundException() );
		ResponseStructure<Driver> rs= new ResponseStructure<Driver>();

			rs.setStatuscode(HttpStatus.FOUND.value());
			rs.setMessage("Carrier deatails found with ID: "+ id);
		    rs.setData(d);
		
		return new ResponseEntity<ResponseStructure<Driver>>(rs,HttpStatus.OK);
		
	}

	@Autowired
	private TruckResp tresp;
	
	@Autowired
	private CarrierResp cresp;
	public ResponseEntity<ResponseStructure<Driver>> updateDriverk(int did, int tid, int cid) {
		
		Driver d = dresp.findById(did).orElseThrow(() -> new DriverNotFoundException());
		Truck t = tresp.findById(tid).orElseThrow(() -> new TruckNotFoundException());
		Carrier c = cresp.findById(cid).orElseThrow(() -> new CarrierNotFoundException());
		
		d.setTruck_id(t);
	    d.setCarrier_id(c);
	    
	    dresp.save(d);
	    
	    ResponseStructure<Driver> rs = new ResponseStructure<>();
	    rs.setStatuscode(HttpStatus.OK.value());
	    rs.setMessage("Driver updated with Truck ID: " + tid + " and Carrier ID: " + cid);
	    rs.setData(d);
	    
	    return new ResponseEntity<ResponseStructure<Driver>>(rs,HttpStatus.OK);

	    
	}



}
