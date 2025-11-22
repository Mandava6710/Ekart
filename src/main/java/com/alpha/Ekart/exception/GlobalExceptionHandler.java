package com.alpha.Ekart.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Carrier;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	
	@ExceptionHandler(exception = CarrierNotFoundException.class)
	public ResponseEntity<ResponseStructure<Carrier>> handleCarrierNotFoundException() {
		
		ResponseStructure<Carrier> rs= new ResponseStructure<Carrier>();
		rs.setStatuscode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Carrier deatails Not found ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<Carrier>>(rs,HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(exception = TruckAlreadyPresentException.class)
	public ResponseEntity<ResponseStructure<Carrier>> handleTruckAlreadyPresentException() {
		
		ResponseStructure<Carrier> rs= new ResponseStructure<Carrier>();
		rs.setStatuscode(HttpStatus.CONFLICT.value());
		rs.setMessage("Truck deatails Already Present ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<Carrier>>(rs,HttpStatus.CONFLICT);
	}
	
	
	@ExceptionHandler(exception = TruckNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleTruckNotFoundException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Truck deatails Not found ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.NOT_FOUND);
	}
	
	
	
//	Driver
	
	
	@ExceptionHandler(exception = DriverAlreadyPresentException.class)
	public ResponseEntity<ResponseStructure<String>> handleDriverAlreadyPresentException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.CONFLICT.value());
		rs.setMessage("Driver deatails Already Present ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.CONFLICT);
	}
	
	
	@ExceptionHandler(exception = DriverNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleDriverNotFoundException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Driver deatails Not found ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.NOT_FOUND);
	}
	
	
//	Address
	
	
	@ExceptionHandler(exception = AddressAlreadyPresentException.class)
	public ResponseEntity<ResponseStructure<String>> handleAddressAlreadyPresentException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.CONFLICT.value());
		rs.setMessage("Address deatails Already Present ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.CONFLICT);
	}
	
	
	@ExceptionHandler(exception = AddressNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleAddressNotFoundException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Address deatails Not found ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.NOT_FOUND);
	}
	
	
	@ExceptionHandler(exception = OrderNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleOrderNotFoundException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Order deatails Not found ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.NOT_FOUND);
	}
	
	
	@ExceptionHandler(exception = TruckCapacityExceededException.class)
	public ResponseEntity<ResponseStructure<String>> handleTruckCapacityExceededException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.OK.value());
		rs.setMessage("Truck does not have enough capacity");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.OK);
	}
	
	
	@ExceptionHandler(exception = LoadingNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleLoadingNotFoundException() {
		
		ResponseStructure<String> rs= new ResponseStructure<String>();
		rs.setStatuscode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Loading deatails Not found ");
	    rs.setData(null);
	    
	    return new ResponseEntity<ResponseStructure<String>>(rs,HttpStatus.NOT_FOUND);
	}
	
}
