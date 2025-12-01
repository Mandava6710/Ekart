package com.alpha.Ekart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration to serve React frontend build files
 * Maps static resources and handles SPA routing without infinite loops
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static frontend build files (CSS, JS, images, etc.)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/frontend/build/static/")
                .setCachePeriod(31536000) // 1 year
                .resourceChain(true);
        
        // Serve public assets (favicon, manifest, etc)
        registry.addResourceHandler("/favicon.ico", "/manifest.json", "/robots.txt")
                .addResourceLocations("classpath:/static/frontend/build/")
                .setCachePeriod(31536000);
        
        // Default servlet for all other resources (including index.html)
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/frontend/build/")
                .setCachePeriod(31536000);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward unmapped requests to index.html for SPA routing
        // This catches all paths that don't have actual files and aren't /api routes
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/{x:[\\w\\-]+}").setViewName("forward:/index.html");
        registry.addViewController("/{x:^(?!api).*$}/**/{y:[\\w\\-]+}").setViewName("forward:/index.html");
    }
}

