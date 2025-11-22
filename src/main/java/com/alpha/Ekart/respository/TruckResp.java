package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.entity.Truck;

@Repository
public interface TruckResp extends JpaRepository<Truck, Integer>{

}
