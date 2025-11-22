package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.dto.OrderDto;
import com.alpha.Ekart.entity.Order;

@Repository
public interface OrderResp extends JpaRepository<Order, Integer>{

	
	

}
