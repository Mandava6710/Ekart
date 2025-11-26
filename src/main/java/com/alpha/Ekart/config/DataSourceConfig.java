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
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            // Parse Railway DATABASE_URL: postgresql://user:password@host:port/database
            String jdbcUrl = "jdbc:" + databaseUrl;
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setMaximumPoolSize(5);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(20000);
            config.setDriverClassName("org.postgresql.Driver");
            
            System.out.println("Created DataSource with JDBC URL from Railway DATABASE_URL");
            return new HikariDataSource(config);
        }
        
        // Fallback - should not happen in production
        throw new RuntimeException("DATABASE_URL environment variable not found or invalid");
    }
}
