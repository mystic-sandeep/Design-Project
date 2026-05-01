package com.mygate.service;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class VehicleLogStore {

    private final List<Map<String, Object>> vehicles = new CopyOnWriteArrayList<>();

    public List<Map<String, Object>> getVehicles() {
        return vehicles;
    }

    public void addVehicle(Map<String, Object> entry) {
        vehicles.add(entry);

        long cutoff = System.currentTimeMillis() - 86400000L;
        vehicles.removeIf(v -> (Long) v.get("timestamp") < cutoff);
    }
}