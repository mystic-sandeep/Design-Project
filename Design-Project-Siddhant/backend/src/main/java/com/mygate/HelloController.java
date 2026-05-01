package com.mygate;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    // Serves from src/main/resources/static/index.html
    // No hardcoded Windows path — works on any machine
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<Resource> index() {
        Resource r = new ClassPathResource("static/index.html");
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(r);
    }
}