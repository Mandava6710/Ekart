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
        System.out.println("PGHOST: " + System.getenv("PGHOST"));
        System.out.println("PGPORT: " + System.getenv("PGPORT"));
        System.out.println("PGDATABASE: " + System.getenv("PGDATABASE"));
        System.out.println("PGUSER: " + System.getenv("PGUSER"));
        System.out.println("PGPASSWORD: " + (System.getenv("PGPASSWORD") != null ? "Set" : "Not set"));
        
        String jdbcUrl;
        
        if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            // Railway provides DATABASE_URL in postgresql:// format
            jdbcUrl = "jdbc:" + databaseUrl;
            System.out.println("Using DATABASE_URL format");
        } else {
            // Fallback: Build from individual PGXXX variables
            String host = System.getenv("PGHOST");
            String port = System.getenv("PGPORT");
            String database = System.getenv("PGDATABASE");
            String user = System.getenv("PGUSER");
            String password = System.getenv("PGPASSWORD");
            
            if (host != null && port != null && database != null && user != null && password != null) {
                jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s?user=%s&password=%s",
                    host, port, database, user, password);
                System.out.println("Using PGXXX environment variables");
            } else {
                System.err.println("ERROR: No valid database configuration found!");
                throw new RuntimeException("No DATABASE_URL or PGXXX variables found");
            }
        }
        
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(20000);
        config.setDriverClassName("org.postgresql.Driver");
        
        System.out.println("DataSource created successfully");
        System.out.println("=====================================");
        
        return new HikariDataSource(config);
    }
}
