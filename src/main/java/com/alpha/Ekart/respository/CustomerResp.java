package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alpha.Ekart.entity.Customer;

@Repository
public interface CustomerResp extends JpaRepository<Customer, Integer> {
	
}
