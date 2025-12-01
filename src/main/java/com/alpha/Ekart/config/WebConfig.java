package com.alpha.Ekart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;

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
        
        // Serve root index.html and SPA routes with fallback
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/frontend/build/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // Don't process /api routes - let controllers handle them
                        if (resourcePath.startsWith("api/") || resourcePath.startsWith("/api/")) {
                            // Return index.html to let Spring handle the 404 gracefully
                            return new ClassPathResource("/static/frontend/build/index.html");
                        }
                        
                        // For empty path or root, serve index.html
                        if (resourcePath.isEmpty() || resourcePath.equals("/") || resourcePath.equals("")) {
                            return new ClassPathResource("/static/frontend/build/index.html");
                        }
                        
                        try {
                            Resource requestedResource = location.createRelative(resourcePath);
                            
                            // If file exists, serve it
                            if (requestedResource.exists() && requestedResource.isReadable()) {
                                return requestedResource;
                            }
                        } catch (Exception e) {
                            // Ignore any errors in resource lookup
                        }
                        
                        // For SPA routing, serve index.html for unknown routes (allows React Router to handle)
                        return new ClassPathResource("/static/frontend/build/index.html");
                    }
                });
    }
}

