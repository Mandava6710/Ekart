package com.alpha.Ekart.service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.OrderDto;
import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Address;
import com.alpha.Ekart.entity.Cargo;
import com.alpha.Ekart.entity.Customer;
import com.alpha.Ekart.entity.Loading;
import com.alpha.Ekart.entity.Order;
import com.alpha.Ekart.entity.Truck;
import com.alpha.Ekart.entity.UnLoading;
import com.alpha.Ekart.exception.LoadingNotFoundException;
import com.alpha.Ekart.exception.OrderNotFoundException;
import com.alpha.Ekart.exception.TruckCapacityExceededException;
import com.alpha.Ekart.exception.TruckNotFoundException;
import com.alpha.Ekart.respository.AddressResp;
import com.alpha.Ekart.respository.CargoResp;
import com.alpha.Ekart.respository.CustomerResp;
import com.alpha.Ekart.respository.LoadingResp;
import com.alpha.Ekart.respository.OrderResp;
import com.alpha.Ekart.respository.TruckResp;
import com.alpha.Ekart.respository.UnLoadingResp;

@Service
public class Service_Order {

	@Autowired
	private OrderResp oresp;

	@Autowired
	private CargoResp cargoresp;

	@Autowired
	private AddressResp addressresp;

	@Autowired
	private LoadingResp loadresp;

	@Autowired
	private UnLoadingResp unloadresp;

	@Autowired
	private CustomerResp customerresp;

	public ResponseEntity<ResponseStructure<Order>> saveOrder(OrderDto o) {

		Order order = new Order();

		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String currentdate = format.format(date);

		order.setOrderdate(currentdate);

		double cost = 100 * (o.getCargoweight() * o.getCargocount());

		order.setCost(cost);
		order.setCarrier(null);
		order.setStatus("placedOrder");  // Set initial status to placedOrder (order just placed, pending for delivery)

		// Set the customer
		if (o.getCustomerid() > 0) {
			Customer customer = customerresp.findById(o.getCustomerid()).orElse(null);
			order.setCustomer(customer);
		}

		Cargo c = new Cargo();
		c.setName(o.getCargoname());
		c.setDescription(o.getCargodescription());
		c.setWeight(o.getCargoweight());
		c.setCount(o.getCargocount());
		c = cargoresp.save(c);

		order.setCargo(c);

		Loading load = new Loading();
		Address address = addressresp.findById(o.getAddressid()).get();
		load.setAddress_id(address);
		load = loadresp.save(load);

		order.setLoading(load);

		UnLoading unload = new UnLoading();
		Address unloadaddress = addressresp.findById(o.getUnaddressid()).get();
		unload.setAddress_id(unloadaddress);
		unload = unloadresp.save(unload);

		order.setUnloading(unload);

		oresp.save(order);

		ResponseStructure<Order> rs = new ResponseStructure<Order>();

		rs.setStatuscode(HttpStatus.CREATED.value());
		rs.setMessage("Order Placed successfully - Pending for delivery");
		rs.setData(order);

		return new ResponseEntity<ResponseStructure<Order>>(rs, HttpStatus.OK);

	}

	
	@Autowired
	private TruckResp tresp;
	public ResponseEntity<ResponseStructure<Order>> updateOrder(int oid, int tid) {
		
		Order order = oresp.findById(oid).orElseThrow(() -> new OrderNotFoundException());
		
		Truck truck = tresp.findById(tid).orElseThrow(()-> new TruckNotFoundException());
		
		double cweight = order.getCargo().getWeight() * order.getCargo().getCount();
		 
		double usedCapacity = 0;
		 
		for (Order order1 : oresp.findAll()) {
		        if (order1.getCarrier() != null && order1.getCarrier().getCid() == truck.getCarrier_id().getCid()) {
		            
		            double orderWeight = order1.getCargo().getWeight() * order1.getCargo().getCount();
		            
		            usedCapacity += orderWeight;
		        }
		  }
		
		 double availableCapacity = truck.getTcapacity() - usedCapacity;
		 if(cweight>availableCapacity) {
			 throw new TruckCapacityExceededException();
		 }		 
		 
		 order.setTruck(truck);  // Set the truck
		 order.setCarrier(truck.getCarrier_id());
		 order.setStatus("pendingDelivery");  // Status changed to pendingDelivery (truck and carrier assigned)
		 oresp.save(order);
		 	 
		 ResponseStructure<Order> rs= new ResponseStructure<Order>();
		 rs.setStatuscode(HttpStatus.OK.value());
		 rs.setMessage("Truck assigned successfully - Order status: Pending for Delivery");
		 rs.setData(order);
		 
		 return new ResponseEntity<ResponseStructure<Order>>(rs,HttpStatus.OK);	 
	}
	
	@Autowired
	private com.alpha.Ekart.respository.CarrierResp carrierresp;
	
	public ResponseEntity<ResponseStructure<Order>> assignCarrierToOrder(int oid, int cid) {
		Order order = oresp.findById(oid).orElseThrow(() -> new OrderNotFoundException());
		
		com.alpha.Ekart.entity.Carrier carrier = carrierresp.findById(cid).orElseThrow(() -> 
			new RuntimeException("Carrier not found"));
		
		order.setCarrier(carrier);
		order.setStatus("pendingDelivery");  // Status: Pending for Delivery (carrier confirmed)
		oresp.save(order);
		
		ResponseStructure<Order> rs = new ResponseStructure<Order>();
		rs.setStatuscode(HttpStatus.OK.value());
		rs.setMessage("Carrier assigned successfully - Order status: Pending for Delivery");
		rs.setData(order);
		
		return new ResponseEntity<ResponseStructure<Order>>(rs, HttpStatus.OK);
	}
	
	@Autowired
	private LoadingResp lresp;
	
	public ResponseEntity<ResponseStructure<Order>> updateLoading(int oid, int lid) {
		
		Order order = oresp.findById(oid).orElseThrow(() -> new OrderNotFoundException());
		
		Loading templateLoading=lresp.findById(lid).orElseThrow(()-> new LoadingNotFoundException());
		
		LocalDate currentDate = LocalDate.now();
	    LocalTime currentTime = LocalTime.now();
	    
	    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

	    String dateStr = currentDate.format(dateFormatter);
	    String timeStr = currentTime.format(timeFormatter);
	    
	    // Create NEW Loading record for this order (don't reuse the same one)
	    Loading newLoad = new Loading();
	    newLoad.setLdate(dateStr);
	    newLoad.setLtime(timeStr);
	    newLoad.setAddress_id(templateLoading.getAddress_id());
	    
	    Loading savedLoad = lresp.save(newLoad);
		
		// Update order status to shipped (loading date assigned, on the way)
		order.setStatus("shipped");
		order.setLoading(savedLoad);
		oresp.save(order);
		
		ResponseStructure<Order> rs=new ResponseStructure<Order>();
		
		rs.setStatuscode(HttpStatus.OK.value());
		rs.setMessage("Loading date updated - Order status: Shipped (On the way)");
		rs.setData(order);
		
		return new ResponseEntity<ResponseStructure<Order>>(rs, HttpStatus.OK);
		
	}
	
	// Mark order as delivered when delivery date is reached
	public ResponseEntity<ResponseStructure<Order>> completeOrder(int oid) {
		
		Order order = oresp.findById(oid).orElseThrow(() -> new OrderNotFoundException());
		
		// Update order status to delivered
		order.setStatus("delivered");
		oresp.save(order);
		
		ResponseStructure<Order> rs = new ResponseStructure<Order>();
		
		rs.setStatuscode(HttpStatus.OK.value());
		rs.setMessage("Order marked as Delivered - Delivery completed");
		rs.setData(order);
		
		return new ResponseEntity<ResponseStructure<Order>>(rs, HttpStatus.OK);
		
	}
	
	
	
	
	
}
