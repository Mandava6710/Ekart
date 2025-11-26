package com.alpha.Ekart.exception;

public class AdminAlreadyPresentException extends RuntimeException {
	@Override
	public String getMessage() {
		return "Admin already exists";
	}
}
