package com.alpha.Ekart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Error handling and root path routing
 * Ensures all unmapped requests serve index.html for SPA
 */
@Controller
public class AppErrorController {

    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }

    @GetMapping("/index.html")
    public String index() {
        return "forward:/index.html";
    }
}

