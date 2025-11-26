package com.alpha.Ekart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EkartApplication {

	public static void main(String[] args) {
		// Set PORT from environment variable if available
		String port = System.getenv("PORT");
		if (port != null && !port.isEmpty()) {
			System.setProperty("server.port", port);
		} else {
			System.setProperty("server.port", "8080");
		}
		
		SpringApplication.run(EkartApplication.class, args);
	}

}
