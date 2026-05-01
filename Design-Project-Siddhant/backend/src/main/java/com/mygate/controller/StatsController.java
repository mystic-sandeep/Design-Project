package com.mygate.controller;

import org.springframework.web.bind.annotation.*;  // ← ADD THIS LINE
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:3000"})  // ← NOW WORKS
public class StatsController {
    
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("guestsToday", 12);
        stats.put("activeStaff", 5);
        stats.put("patrolComplete", 100);
        stats.put("devicesOnline", 8);
        return stats;
    }
}