package com.alpha.Ekart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;

/**
 * Web configuration to serve React frontend build files
 * Maps static resources and handles SPA routing
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static frontend build files (CSS, JS, images, etc.)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/frontend/static/")
                .setCachePeriod(31536000) // 1 year
                .resourceChain(true);
        
        // Serve public assets
        registry.addResourceHandler("/favicon.ico", "/manifest.json")
                .addResourceLocations("classpath:/static/frontend/")
                .setCachePeriod(31536000); // 1 year
        
        // Serve all files, with index.html fallback for SPA routing
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/frontend/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // Serve the requested file if it exists
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // For SPA routing, serve index.html for unknown routes
                        return new ClassPathResource("/static/frontend/index.html");
                    }
                });
    }
}

