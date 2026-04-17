/**
 * JWT Authentication Module for MyGate Frontend
 * Handles login and token management
 */

const API_BASE_URL = "http://localhost:8080";
let authToken = null;
let currentUser = null;

/**
 * Login with email and password
 */
async function jwtLogin(email, password = "password123", role = "resident") {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            
            // Save to localStorage (persists on refresh)
            localStorage.setItem("authToken", authToken);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            
            console.log("✅ Login successful!", currentUser);
            return { success: true, token: authToken, user: currentUser };
        } else {
            console.error("❌ Login failed:", data.message);
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Get stored token (for page reload)
 */
function getStoredToken() {
    const token = localStorage.getItem("authToken");
    if (token) {
        authToken = token;
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
        return token;
    }
    return null;
}

/**
 * Verify token is still valid
 */
async function verifyToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Logout user
 */
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    console.log("✅ Logged out");
    location.reload(); // Reload to show login again
}

/**
 * Make authenticated API call
 */
async function authenticatedFetch(endpoint, options = {}) {
    if (!authToken) {
        alert("❌ No token - Please login first");
        return null;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
        }
    });
    
    if (response.status === 401) {
        alert("❌ Token expired - Please login again");
        logout();
        return null;
    }
    
    return response;
}

/**
 * Initialize auth on page load
 */
document.addEventListener("DOMContentLoaded", function() {
    const storedToken = getStoredToken();
    if (storedToken) {
        console.log("✅ Token restored from storage");
        verifyToken(storedToken).then(isValid => {
            if (!isValid) {
                console.warn("⚠️ Token expired");
                logout();
            }
        });
    }
});