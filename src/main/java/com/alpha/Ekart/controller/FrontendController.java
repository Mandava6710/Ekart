package com.alpha.Ekart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Controller to serve frontend files outside of the /api context path
 */
@Controller
public class FrontendController {
    
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }
    
    @GetMapping("/index.html")
    public String indexHtml() {
        return "forward:/index.html";
    }
    
    /**
     * Catch-all route for SPA (Single Page Application) routing
     * Any undefined route should serve index.html for client-side routing to work
     */
    @GetMapping("/{path:^(?!api).*}")
    public String catchAll() {
        return "forward:/index.html";
    }
}
