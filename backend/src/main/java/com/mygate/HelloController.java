package com.mygate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "🚀 Mygate Backend is Running!";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello Vaishnavi 👋";
    }
}