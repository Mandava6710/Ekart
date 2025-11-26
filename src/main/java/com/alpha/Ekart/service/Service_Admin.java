package com.alpha.Ekart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alpha.Ekart.dto.ResponseStructure;
import com.alpha.Ekart.entity.Admin;
import com.alpha.Ekart.exception.AdminAlreadyPresentException;
import com.alpha.Ekart.exception.AdminNotFoundException;
import com.alpha.Ekart.respository.AdminResp;

@Service
public class Service_Admin {
	
	@Autowired
	private AdminResp aresp;

	public ResponseEntity<ResponseStructure<Admin>> saveAdminData(Admin a) {
		int id = a.getId();
		ResponseStructure<Admin> rs = new ResponseStructure<Admin>();
		
		if(aresp.existsById(id)) {	
			rs.setStatuscode(HttpStatus.CONFLICT.value());
			rs.setMessage("Admin already exists with ID: "+ a.getId());
		    rs.setData(null);	
		}
		else {
			Admin saveAdmin = aresp.save(a);
	        rs.setStatuscode(HttpStatus.CREATED.value());
	        rs.setMessage("Admin saved successfully");
	        rs.setData(saveAdmin);
		}
		
		return new ResponseEntity<ResponseStructure<Admin>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<Admin>> findAdmin(int id) {
		Admin a = aresp.findById(id).orElseThrow(() -> new AdminNotFoundException());
		ResponseStructure<Admin> rs = new ResponseStructure<Admin>();

		rs.setStatuscode(HttpStatus.FOUND.value());
		rs.setMessage("Admin details found with ID: "+ id);
	    rs.setData(a);
		
		return new ResponseEntity<ResponseStructure<Admin>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<Admin>>> getAllAdmins() {
		List<Admin> admins = aresp.findAll();
		ResponseStructure<List<Admin>> rs = new ResponseStructure<List<Admin>>();
		
		if(admins.isEmpty()) {
			rs.setStatuscode(HttpStatus.NOT_FOUND.value());
			rs.setMessage("No admins found");
			rs.setData(null);
		} else {
			rs.setStatuscode(HttpStatus.FOUND.value());
			rs.setMessage("Admins retrieved successfully");
			rs.setData(admins);
		}
		
		return new ResponseEntity<ResponseStructure<List<Admin>>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<Admin>> updateAdmin(Admin a) {
		int id = a.getId();
		ResponseStructure<Admin> rs = new ResponseStructure<Admin>();
		
		if(aresp.existsById(id)) {
			Admin updatedAdmin = aresp.save(a);
			rs.setStatuscode(HttpStatus.OK.value());
			rs.setMessage("Admin updated successfully");
			rs.setData(updatedAdmin);
		} else {
			rs.setStatuscode(HttpStatus.NOT_FOUND.value());
			rs.setMessage("Admin not found with ID: "+ id);
			rs.setData(null);
		}
		
		return new ResponseEntity<ResponseStructure<Admin>>(rs, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<String>> deleteAdmin(int id) {
		ResponseStructure<String> rs = new ResponseStructure<String>();
		
		if(aresp.existsById(id)) {
			aresp.deleteById(id);
			rs.setStatuscode(HttpStatus.OK.value());
			rs.setMessage("Admin deleted successfully");
			rs.setData(null);
		} else {
			rs.setStatuscode(HttpStatus.NOT_FOUND.value());
			rs.setMessage("Admin not found with ID: "+ id);
			rs.setData(null);
		}
		
		return new ResponseEntity<ResponseStructure<String>>(rs, HttpStatus.OK);
	}
}
