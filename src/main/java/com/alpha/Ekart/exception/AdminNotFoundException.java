package com.alpha.Ekart.exception;

public class AdminNotFoundException extends RuntimeException {
	@Override
	public String getMessage() {
		return "Admin not found";
	}
}
