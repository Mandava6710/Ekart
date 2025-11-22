package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.entity.Driver;

@Repository
public interface DriverResp extends JpaRepository<Driver, Integer>{

}
