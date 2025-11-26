package com.alpha.Ekart.exception;

public class CustomerNotFoundException extends RuntimeException {
	@Override
	public String getMessage() {
		return "Customer not found";
	}
}
