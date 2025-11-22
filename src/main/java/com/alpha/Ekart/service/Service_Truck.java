package com.alpha.Ekart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Carrier;
import com.alpha.Ekart.entity.Truck;
import com.alpha.Ekart.exception.CarrierNotFoundException;
import com.alpha.Ekart.exception.TruckAlreadyPresentException;
import com.alpha.Ekart.exception.TruckNotFoundException;
import com.alpha.Ekart.respository.CarrierResp;
import com.alpha.Ekart.respository.TruckResp;

@Service
public class Service_Truck {

	@Autowired
	private TruckResp tresp;

	public ResponseEntity<ResponseStructure<Truck>> saveTruck(Truck t) {

		Boolean present = tresp.existsById(t.getTid());

		ResponseStructure<Truck> rs = new ResponseStructure<Truck>();

		if (present)
			throw new TruckAlreadyPresentException();

		tresp.save(t);
		rs.setStatuscode(HttpStatus.CREATED.value());
		rs.setMessage("Truck Details Created");
		rs.setData(t);

		return new ResponseEntity<ResponseStructure<Truck>>(rs, HttpStatus.CREATED);

	}

	public ResponseEntity<ResponseStructure<Truck>> findTruck(int id) {

		Truck tr = tresp.findById(id).orElseThrow(() -> new TruckNotFoundException());
		ResponseStructure<Truck> rs = new ResponseStructure<Truck>();

		rs.setStatuscode(HttpStatus.FOUND.value());
		rs.setMessage("Truck deatails found with ID: " + id);
		rs.setData(tr);

		return new ResponseEntity<ResponseStructure<Truck>>(rs, HttpStatus.OK);

	}

	@Autowired
	private CarrierResp cresp;

	public ResponseEntity<ResponseStructure<Truck>> updateTruck(int tid, int cid) {

		Truck tr = tresp.findById(tid).orElseThrow(() -> new TruckNotFoundException());

		Carrier cr = cresp.findById(cid).orElseThrow(() -> new CarrierNotFoundException());

		tr.setCarrier_id(cr);

		tresp.save(tr);

		ResponseStructure<Truck> rs = new ResponseStructure<Truck>();
		rs.setStatuscode(HttpStatus.OK.value());
		rs.setMessage("Truck updated with Carrier ID: " + cid);
		rs.setData(tr);

		return new ResponseEntity<ResponseStructure<Truck>>(rs, HttpStatus.OK);

	}

}
