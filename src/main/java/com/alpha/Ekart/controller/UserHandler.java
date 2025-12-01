package com.alpha.Ekart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.alpha.Ekart.dto.OrderDto;
import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Order;
import com.alpha.Ekart.respository.OrderResp;
import com.alpha.Ekart.service.Service_Order;

@RestController
@org.springframework.web.bind.annotation.RequestMapping("/api")
public class UserHandler {
	
	@Autowired
	private Service_Order sorder;
	
	@PostMapping("/saveOrder")
	public ResponseEntity<ResponseStructure<Order>> saveOrder(@RequestBody OrderDto o) {
		return sorder.saveOrder(o);
		
	}

	
}
