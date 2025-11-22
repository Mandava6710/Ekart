package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alpha.Ekart.entity.Carrier;

@Repository
public interface CarrierResp extends JpaRepository<Carrier, Integer>{

}
