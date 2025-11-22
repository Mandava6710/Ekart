package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.entity.Cargo;

@Repository
public interface CargoResp extends JpaRepository<Cargo, Integer>{

}
