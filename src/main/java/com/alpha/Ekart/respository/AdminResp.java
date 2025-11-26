package com.alpha.Ekart.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alpha.Ekart.entity.Admin;

@Repository
public interface AdminResp extends JpaRepository<Admin, Integer> {
	
}
