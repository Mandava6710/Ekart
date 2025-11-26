package com.alpha.Ekart.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        // Try DATABASE_URL first (Railway format)
        String databaseUrl = System.getenv("DATABASE_URL");
        
        System.out.println("=== Database Configuration Debug ===");
        System.out.println("DATABASE_URL: " + (databaseUrl != null ? "Found" : "Not found"));
        
        if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            // Parse Railway DATABASE_URL: postgresql://user:password@host:port/database
            // Just add "jdbc:" prefix - HikariCP will parse the rest correctly
            String jdbcUrl = "jdbc:" + databaseUrl;
            
            System.out.println("Using DATABASE_URL format");
            System.out.println("JDBC URL constructed (credentials hidden)");
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setMaximumPoolSize(5);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(30000);
            config.setDriverClassName("org.postgresql.Driver");
            
            // Additional connection properties for Railway
            config.addDataSourceProperty("ApplicationName", "Ekart");
            
            System.out.println("DataSource created successfully");
            System.out.println("=====================================");
            
            return new HikariDataSource(config);
        }
        
        // Fallback: Build from individual PGXXX variables
        String host = System.getenv("PGHOST");
        String port = System.getenv("PGPORT");
        String database = System.getenv("PGDATABASE");
        String user = System.getenv("PGUSER");
        String password = System.getenv("PGPASSWORD");
        
        System.out.println("PGHOST: " + host);
        System.out.println("PGPORT: " + port);
        System.out.println("PGDATABASE: " + database);
        System.out.println("PGUSER: " + user);
        System.out.println("PGPASSWORD: " + (password != null ? "Set" : "Not set"));
        
        if (host != null && port != null && database != null && user != null && password != null) {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(String.format("jdbc:postgresql://%s:%s/%s", host, port, database));
            config.setUsername(user);
            config.setPassword(password);
            config.setMaximumPoolSize(5);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(30000);
            config.setDriverClassName("org.postgresql.Driver");
            
            System.out.println("Using PGXXX environment variables");
            System.out.println("DataSource created successfully");
            System.out.println("=====================================");
            
            return new HikariDataSource(config);
        }
        
        System.err.println("ERROR: No valid database configuration found!");
        throw new RuntimeException("No DATABASE_URL or PGXXX variables found");
    }
}
