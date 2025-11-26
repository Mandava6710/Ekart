package com.alpha.Ekart.exception;

public class CustomerAlreadyPresentException extends RuntimeException {
	@Override
	public String getMessage() {
		return "Customer already exists";
	}
}
