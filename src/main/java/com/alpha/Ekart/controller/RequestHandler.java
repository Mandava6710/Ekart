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
import com.alpha.Ekart.dto.OrderDto;
import com.alpha.Ekart.entity.Address;
import com.alpha.Ekart.entity.Carrier;
import com.alpha.Ekart.entity.Driver;
import com.alpha.Ekart.entity.Order;
import com.alpha.Ekart.entity.Truck;
import com.alpha.Ekart.entity.Customer;
import com.alpha.Ekart.entity.Admin;
import com.alpha.Ekart.service.Service_Address;
import com.alpha.Ekart.service.Service_Carrier;
import com.alpha.Ekart.service.Service_Driver;
import com.alpha.Ekart.service.Service_Loading;
import com.alpha.Ekart.service.Service_Order;
import com.alpha.Ekart.service.Service_Truck;
import com.alpha.Ekart.service.Service_Customer;
import com.alpha.Ekart.service.Service_Admin;
import com.alpha.Ekart.respository.OrderResp;
import com.alpha.Ekart.respository.AddressResp;
import java.util.List;

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
	
	@GetMapping("/carriers")
	public ResponseEntity<ResponseStructure<List<Carrier>>> getAllCarriers() {
		ResponseStructure<List<Carrier>> rs = new ResponseStructure<>();
		try {
			List<Carrier> carriers = caresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Carriers retrieved successfully");
			rs.setData(carriers);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving carriers: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@Autowired
	private com.alpha.Ekart.respository.CarrierResp caresp;
	
	
	
	
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
	
	@GetMapping("/trucks")
	public ResponseEntity<ResponseStructure<List<Truck>>> getAllTrucks() {
		ResponseStructure<List<Truck>> rs = new ResponseStructure<>();
		try {
			List<Truck> trucks = tresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Trucks retrieved successfully");
			rs.setData(trucks);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving trucks: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@PutMapping("updatetruck/{tid}/assigncarrier/{cid}")
	public ResponseEntity<ResponseStructure<Truck>> updateTruck(@PathVariable int tid,@PathVariable int cid) {
		return struck.updateTruck(tid,cid);
	}
	
	@Autowired
	private com.alpha.Ekart.respository.TruckResp tresp;
	
	
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
	
	@GetMapping("/drivers")
	public ResponseEntity<ResponseStructure<List<Driver>>> getAllDrivers() {
		ResponseStructure<List<Driver>> rs = new ResponseStructure<>();
		try {
			List<Driver> drivers = dresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Drivers retrieved successfully");
			rs.setData(drivers);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving drivers: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@PutMapping("updatedriver/{did}/assigntruck/{tid}/assigncarrier/{cid}")
	public ResponseEntity<ResponseStructure<Driver>> updateDriver(@PathVariable int did, @PathVariable int tid,@PathVariable int cid) {
		return sdriver.updateDriverk(did,tid,cid);
	}
	
	@Autowired
	private com.alpha.Ekart.respository.DriverResp dresp;
	
	
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
	
	@GetMapping("/addresses")
	public ResponseEntity<ResponseStructure<List<Address>>> getAllAddresses() {
		ResponseStructure<List<Address>> rs = new ResponseStructure<>();
		try {
			List<Address> addresses = aresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Addresses retrieved successfully");
			rs.setData(addresses);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving addresses: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@Autowired
	private AddressResp aresp;
	
	
	
//	order
	
	@Autowired   
	private Service_Order sorder;
	
	@PostMapping("/orders")
	public ResponseEntity<ResponseStructure<Order>> createOrder(@RequestBody OrderDto o) {
		return sorder.saveOrder(o);
	}
	
	@GetMapping("/orders")
	public ResponseEntity<ResponseStructure<List<Order>>> getAllOrders() {
		ResponseStructure<List<Order>> rs = new ResponseStructure<>();
		try {
			List<Order> orders = oresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Orders retrieved successfully");
			rs.setData(orders);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving orders: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@GetMapping("/orders/{id}")
	public ResponseEntity<ResponseStructure<Order>> getOrderById(@PathVariable int id) {
		ResponseStructure<Order> rs = new ResponseStructure<>();
		try {
			Order order = oresp.findById(id).orElse(null);
			if (order != null) {
				rs.setStatuscode(200);
				rs.setMessage("Order retrieved successfully");
				rs.setData(order);
			} else {
				rs.setStatuscode(404);
				rs.setMessage("Order not found");
				rs.setData(null);
			}
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving order: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@PutMapping("/updateorder/{oid}/assigncarrier/{tid}")
	public ResponseEntity<ResponseStructure<Order>> updateOrderWithCarrier(@PathVariable int oid,@PathVariable int tid) {
		return sorder.updateOrder(oid,tid);
	}
	
	@PutMapping("/orders/{oid}/assigncarrier/{cid}")
	public ResponseEntity<ResponseStructure<Order>> assignCarrierToOrder(@PathVariable int oid, @PathVariable int cid) {
		return sorder.assignCarrierToOrder(oid, cid);
	}
	
	@PutMapping("/updateloading/{oid}/assigndate/{lid}")
	public ResponseEntity<ResponseStructure<Order>> updateLoading(@PathVariable int oid,@PathVariable int lid) {
		return sorder.updateLoading(oid,lid);
	}
	
	@PutMapping("/orders/{id}/cancel")
	public ResponseEntity<ResponseStructure<Order>> cancelOrder(@PathVariable int id) {
		ResponseStructure<Order> rs = new ResponseStructure<>();
		try {
			Order order = oresp.findById(id).orElse(null);
			if (order != null) {
				order.setStatus("cancelled");
				oresp.save(order);
				rs.setStatuscode(200);
				rs.setMessage("Order cancelled successfully");
				rs.setData(order);
			} else {
				rs.setStatuscode(404);
				rs.setMessage("Order not found");
				rs.setData(null);
			}
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error cancelling order: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}
	
	@PutMapping("/orders/{id}/complete")
	public ResponseEntity<ResponseStructure<Order>> completeOrder(@PathVariable int id) {
		return sorder.completeOrder(id);
	}
	
	@Autowired
	private OrderResp oresp;

	// Customer Endpoints
	@Autowired
	private Service_Customer scustomer;

	@PostMapping("/saveCustomer")
	public ResponseEntity<ResponseStructure<Customer>> saveCustomer(@RequestBody Customer c) {
		return scustomer.saveCustomerData(c);
	}

	@GetMapping("/findCustomer")
	public ResponseEntity<ResponseStructure<Customer>> findCustomer(@RequestParam int id) {
		return scustomer.findCustomer(id);
	}

	@GetMapping("/getAllCustomers")
	public ResponseEntity<ResponseStructure<List<Customer>>> getAllCustomers() {
		return scustomer.getAllCustomers();
	}

	@PutMapping("/updateCustomer")
	public ResponseEntity<ResponseStructure<Customer>> updateCustomer(@RequestBody Customer c) {
		return scustomer.updateCustomer(c);
	}

	@PostMapping("/deleteCustomer/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteCustomer(@PathVariable int id) {
		return scustomer.deleteCustomer(id);
	}

	// Admin Endpoints
	@Autowired
	private Service_Admin sadmin;

	@PostMapping("/saveAdmin")
	public ResponseEntity<ResponseStructure<Admin>> saveAdmin(@RequestBody Admin a) {
		return sadmin.saveAdminData(a);
	}

	@GetMapping("/findAdmin")
	public ResponseEntity<ResponseStructure<Admin>> findAdmin(@RequestParam int id) {
		return sadmin.findAdmin(id);
	}

	@GetMapping("/getAllAdmins")
	public ResponseEntity<ResponseStructure<List<Admin>>> getAllAdmins() {
		return sadmin.getAllAdmins();
	}

	@PutMapping("/updateAdmin")
	public ResponseEntity<ResponseStructure<Admin>> updateAdmin(@RequestBody Admin a) {
		return sadmin.updateAdmin(a);
	}

	@PostMapping("/deleteAdmin/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteAdmin(@PathVariable int id) {
		return sadmin.deleteAdmin(id);
	}

	// Loading and UnLoading Endpoints
	@Autowired
	private com.alpha.Ekart.respository.LoadingResp loadresp;

	@Autowired
	private com.alpha.Ekart.respository.UnLoadingResp unloadresp;

	@GetMapping("/loadings")
	public ResponseEntity<ResponseStructure<List<com.alpha.Ekart.entity.Loading>>> getAllLoadings() {
		ResponseStructure<List<com.alpha.Ekart.entity.Loading>> rs = new ResponseStructure<>();
		try {
			List<com.alpha.Ekart.entity.Loading> loadings = loadresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Loadings retrieved successfully");
			rs.setData(loadings);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving loadings: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}

	@GetMapping("/unloadings")
	public ResponseEntity<ResponseStructure<List<com.alpha.Ekart.entity.UnLoading>>> getAllUnloadings() {
		ResponseStructure<List<com.alpha.Ekart.entity.UnLoading>> rs = new ResponseStructure<>();
		try {
			List<com.alpha.Ekart.entity.UnLoading> unloadings = unloadresp.findAll();
			rs.setStatuscode(200);
			rs.setMessage("Unloadings retrieved successfully");
			rs.setData(unloadings);
		} catch (Exception e) {
			rs.setStatuscode(500);
			rs.setMessage("Error retrieving unloadings: " + e.getMessage());
			rs.setData(null);
		}
		return new ResponseEntity<>(rs, org.springframework.http.HttpStatus.OK);
	}

}
