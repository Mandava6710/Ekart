package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.entity.Loading;

@Repository
public interface LoadingResp extends JpaRepository<Loading, Integer>{

}
