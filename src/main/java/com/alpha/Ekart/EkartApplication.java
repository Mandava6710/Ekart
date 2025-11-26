package com.alpha.Ekart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EkartApplication {

	public static void main(String[] args) {
		// Handle Railway environment variables BEFORE Spring loads
		String databaseUrl = System.getenv("DATABASE_URL");
		String port = System.getenv("PORT");
		
		// Convert DATABASE_URL from Railway format to JDBC format
		if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
			// Railway: postgresql://user:password@host:port/db
			// Spring: jdbc:postgresql://user:password@host:port/db
			System.setProperty("spring.datasource.url", "jdbc:" + databaseUrl);
			System.out.println("DATABASE_URL converted to JDBC format");
		}
		
		// Set PORT for server
		if (port != null && !port.isEmpty()) {
			System.setProperty("server.port", port);
			System.out.println("PORT set to: " + port);
		} else {
			System.setProperty("server.port", "8080");
			System.out.println("PORT set to default: 8080");
		}
		
		SpringApplication app = new SpringApplication(EkartApplication.class);
		app.run(args);
	}

}
