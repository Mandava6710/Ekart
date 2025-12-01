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
        
        // Serve all other files, with index.html fallback for SPA routing
        // This handler has lowest priority and only handles resources that don't match above
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/frontend/build/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If file exists, serve it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // For SPA routing, serve index.html for unknown routes
                        // But NOT for /api routes (let controllers handle those)
                        if (!resourcePath.startsWith("api/")) {
                            return new ClassPathResource("/static/frontend/build/index.html");
                        }
                        
                        return null;
                    }
                });
    }
}

