package com.mygate.enums;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Role enum with permissions
 */
public enum Role {
    RESIDENT(
        "Resident",
        new String[]{"approveVisitor", "viewBills", "manageVehicles", "fileComplaint", "hireMaid"}
    ),
    GUARD(
        "Guard",
        new String[]{"registerVisitor", "markEntry", "markExit", "logVehicle", "checkIn", "checkOut"}
    ),
    ADMIN(
        "Admin",
        new String[]{"*"} // Can do everything
    ),
    STAFF(
        "Staff",
        new String[]{"checkIn", "checkOut", "viewTasks"}
    ),
    MAID(
        "Maid",
        new String[]{"checkIn", "checkOut", "viewAssignments"}
    );
    
    private final String displayName;
    private final Set<String> permissions;
    
    Role(String displayName, String[] permissions) {
        this.displayName = displayName;
        this.permissions = new HashSet<>(Arrays.asList(permissions));
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public Set<String> getPermissions() {
        return permissions;
    }
    
    /**
     * Check if role has permission
     */
    public boolean hasPermission(String permission) {
        if (permissions.contains("*")) {
            return true; // Admin has all permissions
        }
        return permissions.contains(permission);
    }
    
    /**
     * Get role from string
     */
    public static Role fromString(String roleStr) {
        try {
            return Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return RESIDENT; // Default role
        }
    }
}