package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.entity.Address;

@Repository
public interface AddressResp extends JpaRepository<Address, Integer>{

}
