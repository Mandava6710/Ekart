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
		
		// Convert Railway's DATABASE_URL format to JDBC format
		String databaseUrl = System.getenv("DATABASE_URL");
		if (databaseUrl != null && !databaseUrl.isEmpty()) {
			// Railway provides: postgresql://user:password@host:port/db
			// Spring needs: jdbc:postgresql://user:password@host:port/db
			if (databaseUrl.startsWith("postgresql://")) {
				databaseUrl = "jdbc:" + databaseUrl;
				System.setProperty("spring.datasource.url", databaseUrl);
			}
		}
		
		SpringApplication.run(EkartApplication.class, args);
	}

}
