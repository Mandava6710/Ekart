package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alpha.Ekart.entity.UnLoading;

@Repository
public interface UnLoadingResp extends JpaRepository<UnLoading, Integer>{

}
