package com.mygate.service;

import com.mygate.entity.*;
import com.mygate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private VisitorRepository visitorRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private PatrolCheckpointRepository checkpointRepository;
    @Autowired private PatrolLogRepository patrolLogRepository;
    @Autowired private SmartDeviceRepository deviceRepository;
    @Autowired private ResidentRepository residentRepository;
    @Autowired private VehicleLogStore vehicleLogStore;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    // ── STATS ────────────────────────────────────────────────────────────────
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("guestsToday",         visitorRepository.count());
        s.put("pendingVisitors",      visitorRepository.countByStatus("pending"));
        s.put("activeStaff",          staffRepository.countByEntryTimeAfter(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0)));
        s.put("totalCheckpoints",     checkpointRepository.count());
        s.put("patrolComplete",       100);
        s.put("patrolLogsToday",      patrolLogRepository.countByTimestampAfter(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0)));
        s.put("devicesOnline",        deviceRepository.countByStatus("online"));
        s.put("totalResidents",       residentRepository.count());
        s.put("vehiclesLoggedToday",  vehicleLogStore.getVehicles().size());
        return s;
    }

    // ── VISITORS ─────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getAllVisitors() {
        return visitorRepository.findAllByOrderByIdDesc()
                .stream().map(v -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",               v.getId());
                    m.put("visitor_name",     v.getName() != null ? v.getName() : "");
                    m.put("apartment_number", v.getApartmentNumber() != null ? v.getApartmentNumber() : "");
                    m.put("reason_of_visit",  v.getReasonOfVisit() != null ? v.getReasonOfVisit() : "");
                    m.put("phone",            v.getPhone() != null ? v.getPhone() : "");
                    m.put("status",           v.getStatus() != null ? v.getStatus() : "pending");
                    m.put("registered_at",    v.getArrivalTime() != null ? v.getArrivalTime().format(FMT) : "");
                    return m;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> addVisitor(Map<String, String> body) {
        Visitor v = new Visitor();
        v.setName(body.getOrDefault("visitorName", body.getOrDefault("name", "Unknown")));
        v.setVisitorType(body.getOrDefault("visitorType", "guest"));
        v.setPhone(body.getOrDefault("contactNumber", body.getOrDefault("phone", "")));
        v.setVehicleNo(body.getOrDefault("vehicleNo", ""));
        v.setApartmentNumber(body.getOrDefault("apartmentNumber", body.getOrDefault("apartment", "")));
        v.setReasonOfVisit(body.getOrDefault("reasonOfVisit", body.getOrDefault("reason", "")));
        v.setStatus("pending");
        v.setArrivalTime(LocalDateTime.now());

        if (body.get("residentId") != null) {
            try { v.setResidentId(Long.parseLong(body.get("residentId"))); }
            catch (NumberFormatException ignored) {}
        }
        visitorRepository.save(v);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id",               v.getId());
        res.put("visitor_name",     v.getName());
        res.put("apartment_number", v.getApartmentNumber() != null ? v.getApartmentNumber() : "");
        res.put("reason_of_visit",  v.getReasonOfVisit() != null ? v.getReasonOfVisit() : "");
        res.put("status",           v.getStatus());
        return res;
    }

    public Map<String, Object> updateVisitorStatus(Long id, String status) {
        Visitor v = visitorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));
        v.setStatus(status);
        visitorRepository.save(v);
        return Map.of("id", v.getId(), "status", v.getStatus());
    }

    public void deleteVisitor(Long id) { visitorRepository.deleteById(id); }

    // ── STAFF ─────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getAllStaff() {
        return staffRepository.findAllByOrderByEntryTimeDesc()
                .stream().map(s -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",       s.getId());
                    m.put("name",     s.getName());
                    m.put("role",     s.getType());
                    m.put("phone",    s.getPhone());
                    m.put("check_in", s.getEntryTime() != null ? s.getEntryTime().format(FMT) : "");
                    m.put("check_out", s.getExitTime() != null ? s.getExitTime().format(FMT) : "");
                    m.put("status",   s.getExitTime() == null ? "active" : "exited");
                    return m;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> addStaff(Map<String, String> body) {
        StaffMember s = new StaffMember();
        s.setName(body.getOrDefault("name", "Unknown"));
        s.setType(body.getOrDefault("role", body.getOrDefault("type", "Other")));
        s.setPhone(body.getOrDefault("phone", ""));
        s.setEntryTime(LocalDateTime.now());
        if (body.get("residentId") != null) {
            try { s.setResidentId(Long.parseLong(body.get("residentId"))); }
            catch (NumberFormatException ignored) {}
        }
        staffRepository.save(s);
        return Map.of("id", s.getId(), "name", s.getName(), "status", "active");
    }

    public Map<String, Object> recordStaffExit(Long id) {
        StaffMember s = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        if (s.getExitTime() == null) {
            s.setExitTime(LocalDateTime.now());
            staffRepository.save(s);
        }
        return Map.of("id", s.getId(), "status", "exited");
    }

    public void deleteStaff(Long id) { staffRepository.deleteById(id); }

    // ── PATROL ────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getAllCheckpoints() {
        return checkpointRepository.findAll()
                .stream().map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",       c.getId());
                    m.put("name",     c.getName());
                    m.put("location", c.getLocation());
                    return m;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> addCheckpoint(Map<String, String> body) {
        PatrolCheckpoint cp = new PatrolCheckpoint();
        cp.setName(body.getOrDefault("name", "Checkpoint"));
        cp.setLocation(body.getOrDefault("location", ""));
        checkpointRepository.save(cp);
        return Map.of("id", cp.getId(), "name", cp.getName());
    }

    public List<Map<String, Object>> getRecentPatrolLogs() {
        return patrolLogRepository.findTop50ByOrderByTimestampDesc()
                .stream().map(l -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",              l.getId());
                    m.put("guard_name",      l.getGuardId());
                    m.put("checkpoint_name", l.getCheckpoint() != null ? l.getCheckpoint().getName() : "—");
                    m.put("gpsLocation",     l.getGpsLocation());
                    m.put("logged_at",       l.getTimestamp() != null ? l.getTimestamp().format(FMT) : "");
                    return m;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> recordPatrol(Map<String, String> body) {
        PatrolLog log = new PatrolLog();
        log.setGuardId(body.getOrDefault("guardName", body.getOrDefault("guardId", "Guard")));
        log.setGpsLocation(body.getOrDefault("gpsLocation", ""));
        log.setTimestamp(LocalDateTime.now());
        if (body.get("checkpointId") != null) {
            try {
                Long cpId = Long.parseLong(body.get("checkpointId"));
                checkpointRepository.findById(cpId).ifPresent(log::setCheckpoint);
            } catch (NumberFormatException ignored) {}
        }
        patrolLogRepository.save(log);
        return Map.of("id", log.getId());
    }

    // ── DEVICES ───────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getAllDevices() {
        return deviceRepository.findAll()
                .stream().map(d -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",       d.getId());
                    m.put("name",     d.getName());
                    m.put("type",     d.getType());
                    m.put("location", d.getLocation());
                    m.put("status",   d.getStatus());
                    return m;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> addDevice(Map<String, String> body) {
        SmartDevice d = new SmartDevice();
        d.setName(body.getOrDefault("name", "Device"));
        d.setType(body.getOrDefault("type", "camera"));
        d.setLocation(body.getOrDefault("location", ""));
        d.setStatus("offline");
        deviceRepository.save(d);
        return Map.of("id", d.getId(), "name", d.getName(), "status", d.getStatus());
    }

    public Map<String, Object> controlDevice(Long id, String action) {
        SmartDevice d = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        d.setStatus("online".equalsIgnoreCase(action) ? "online" : "offline");
        deviceRepository.save(d);
        return Map.of("id", d.getId(), "status", d.getStatus());
    }

    public void deleteDevice(Long id) { deviceRepository.deleteById(id); }

    // ── RESIDENTS ─────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getAllResidents() {
        return residentRepository.findAll()
                .stream().map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",        r.getId());
                    m.put("name",      r.getName());
                    m.put("email",     "");
                    m.put("apartment", r.getFlatNumber());
                    m.put("phone",     r.getPhone());
                    m.put("status",    "active");
                    return m;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> addResident(Map<String, String> body) {
        Resident r = new Resident();
        String apt = body.getOrDefault("apartment", body.getOrDefault("flatNumber", ""));
        String id  = body.getOrDefault("id", apt.isEmpty()
                ? UUID.randomUUID().toString().substring(0, 8) : apt);
        r.setId(id);
        r.setName(body.getOrDefault("name", "Unknown"));
        r.setPhone(body.getOrDefault("phone", ""));
        r.setFlatNumber(apt);
        residentRepository.save(r);
        return Map.of("id", r.getId(), "name", r.getName(), "status", "active");
    }

    public void deleteResident(Long id) {
        residentRepository.deleteById(String.valueOf(id));
    }

    public void deleteResidentByStringId(String id) {
        residentRepository.deleteById(id);
    }

    // ── VEHICLES ──────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getLoggedVehicles() {
        List<Map<String, Object>> raw = vehicleLogStore.getVehicles();
        List<Map<String, Object>> result = new ArrayList<>();
        int i = 1;
        for (Map<String, Object> v : raw) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id",             i++);
            m.put("vehicle_number", v.getOrDefault("vehicleNumber", "—"));
            m.put("category",       v.getOrDefault("category", "—"));
            m.put("owner_name",     v.getOrDefault("ownerName", "—"));
            m.put("logged_by",      "Guard");
            m.put("time_logged",    v.getOrDefault("timeLogged", "—"));
            result.add(m);
        }
        return result;
    }
}