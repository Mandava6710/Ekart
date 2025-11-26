package com.alpha.Ekart.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        System.out.println("=== Database Configuration Debug ===");
        System.out.println("DATABASE_URL: " + (databaseUrl != null ? "Found" : "Not found"));
        
        if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            try {
                // Parse Railway DATABASE_URL: postgresql://user:password@host:port/database
                URI uri = new URI(databaseUrl);
                
                String host = uri.getHost();
                int port = uri.getPort();
                String database = uri.getPath().substring(1); // Remove leading "/"
                String userInfo = uri.getUserInfo();
                
                String username = null;
                String password = null;
                
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }
                
                System.out.println("Parsed connection details:");
                System.out.println("  Host: " + host);
                System.out.println("  Port: " + port);
                System.out.println("  Database: " + database);
                System.out.println("  Username: " + username);
                System.out.println("  Password: " + (password != null ? "***" : "null"));
                
                // Build JDBC URL without credentials
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
                
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
                config.setMaximumPoolSize(5);
                config.setMinimumIdle(1);
                config.setConnectionTimeout(30000);
                config.setDriverClassName("org.postgresql.Driver");
                config.addDataSourceProperty("ApplicationName", "Ekart");
                
                System.out.println("DataSource created successfully");
                System.out.println("=====================================");
                
                return new HikariDataSource(config);
                
            } catch (Exception e) {
                System.err.println("Error parsing DATABASE_URL: " + e.getMessage());
                throw new RuntimeException("Failed to parse DATABASE_URL", e);
            }
        }
        
        // Fallback: Build from individual PGXXX variables
        String host = System.getenv("PGHOST");
        String port = System.getenv("PGPORT");
        String database = System.getenv("PGDATABASE");
        String user = System.getenv("PGUSER");
        String password = System.getenv("PGPASSWORD");
        
        System.out.println("Trying PGXXX environment variables:");
        System.out.println("  PGHOST: " + host);
        System.out.println("  PGPORT: " + port);
        System.out.println("  PGDATABASE: " + database);
        System.out.println("  PGUSER: " + user);
        System.out.println("  PGPASSWORD: " + (password != null ? "Set" : "Not set"));
        
        if (host != null && port != null && database != null && user != null && password != null) {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(String.format("jdbc:postgresql://%s:%s/%s", host, port, database));
            config.setUsername(user);
            config.setPassword(password);
            config.setMaximumPoolSize(5);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(30000);
            config.setDriverClassName("org.postgresql.Driver");
            
            System.out.println("DataSource created successfully using PGXXX variables");
            System.out.println("=====================================");
            
            return new HikariDataSource(config);
        }
        
        System.err.println("ERROR: No valid database configuration found!");
        throw new RuntimeException("No DATABASE_URL or PGXXX variables found");
    }
}
