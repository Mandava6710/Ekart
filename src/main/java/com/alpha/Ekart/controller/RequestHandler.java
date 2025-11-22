package com.alpha.Ekart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Address;
import com.alpha.Ekart.entity.Carrier;
import com.alpha.Ekart.entity.Driver;
import com.alpha.Ekart.entity.Order;
import com.alpha.Ekart.entity.Truck;
import com.alpha.Ekart.service.Service_Address;
import com.alpha.Ekart.service.Service_Carrier;
import com.alpha.Ekart.service.Service_Driver;
import com.alpha.Ekart.service.Service_Loading;
import com.alpha.Ekart.service.Service_Order;
import com.alpha.Ekart.service.Service_Truck;

@RestController
public class RequestHandler {

	@Autowired
	private Service_Carrier service;
	
	@PostMapping("/savecarrier")
	public ResponseEntity<ResponseStructure<Carrier>> saveCarrier(@RequestBody Carrier c) {
		return service.saveCarrierData(c);
	}
	
	@GetMapping("/findcarrier")
	public ResponseEntity<ResponseStructure<Carrier>> findCarrier(@RequestParam int id) {
		return service.findCarrier(id);
	}
	
	
	
	
//	Truck 
	
	@Autowired
	private Service_Truck struck;
	
	@PostMapping("/saveTruck")
	public ResponseEntity<ResponseStructure<Truck>> saveTruck(@RequestBody Truck t) {
		return struck.saveTruck(t);
	}
	
	@GetMapping("/findTruck")
	public ResponseEntity<ResponseStructure<Truck>> findTruck(@RequestParam int id) {
		return struck.findTruck(id);
	}
	
	@PutMapping("updatetruck/{tid}/assigncarrier/{cid}")
	public ResponseEntity<ResponseStructure<Truck>> updateTruck(@PathVariable int tid,@PathVariable int cid) {
		return struck.updateTruck(tid,cid);
	}
	
	
//	Driver
	
	@Autowired
	private Service_Driver sdriver;
	
	@PostMapping("/saveDriver")
	public ResponseEntity<ResponseStructure<Driver>> saveDriver(@RequestBody Driver d) {
		return sdriver.saveDriver(d);
	}
	
	@GetMapping("findDriver")
	public ResponseEntity<ResponseStructure<Driver>> findDriver(@RequestParam int id) {
		return sdriver.findDriver(id);
	}
	
	
	@PutMapping("updatedriver/{did}/assigntruck/{tid}/assigncarrier/{cid}")
	public ResponseEntity<ResponseStructure<Driver>> updateDriver(@PathVariable int did, @PathVariable int tid,@PathVariable int cid) {
		return sdriver.updateDriverk(did,tid,cid);
	}
	
	
//	Address
	
	@Autowired
	private Service_Address saddress;
	
	
	@PostMapping("/saveAddress")
	public ResponseEntity<ResponseStructure<Address>> saveAddress(@RequestBody Address a) {
		return saddress.saveAddress(a);
	}
	
	@GetMapping("findAddress")
	public ResponseEntity<ResponseStructure<Address>> findAddress(@RequestParam int id) {
		return saddress.findAddress(id);
	}
	
	
	
//	order
	
	@Autowired   
	private Service_Order sorder;
	
	@PutMapping("/updateorder/{oid}/assigncarrier/{tid}")
	public ResponseEntity<ResponseStructure<Order>> updateOrder(@PathVariable int oid,@PathVariable int tid) {
		return sorder.updateOrder(oid,tid);
	}
	
	@PutMapping("/updateloading/{oid}/assigndate/{lid}")
	public ResponseEntity<ResponseStructure<Order>> updateLoading(@PathVariable int oid,@PathVariable int lid) {
		return sorder.updateLoading(oid,lid);
	}

}
