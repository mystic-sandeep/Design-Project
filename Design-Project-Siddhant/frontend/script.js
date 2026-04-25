// ================= BASE URL =================
const BASE_URL = "http://localhost:8080";

// ================= TOKEN STORAGE =================
function getStoredToken() {
    return localStorage.getItem("token");
}

function saveToken(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
    localStorage.clear();
    location.reload();
}

// ================= AUTH LOGIN =================
async function jwtLogin(email, password, role) {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            saveToken(data.token, data.user);
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message || "Login failed" };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ================= AUTH FETCH =================
async function authenticatedFetch(url, options = {}) {
    const token = getStoredToken();

    if (!token) {
        alert("Session expired. Please login again.");
        return null;
    }

    options.headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    return fetch(url, options);
}

// ================= APPROVE GUEST =================
async function approveGuest() {
    const residentId = document.getElementById('residentId').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const purpose = document.getElementById('purpose').value;

    if (!residentId || !name || !phone) {
        showResult('approveResult', '❌ Please fill all required fields', 'error');
        return;
    }

    try {
        const response = await authenticatedFetch(`${BASE_URL}/api/v2/guests/approve`, {
            method: 'POST',
            body: JSON.stringify({ residentId, name, phone, purpose })
        });

        if (!response) return;

        const data = await response.json();

        if (data.success) {
            showResult('approveResult',
                `✅ Guest "${name}" approved!\n\n📝 Pass Code: ${data.passCode}`,
                'success'
            );
            clearForm();
        } else {
            showResult('approveResult', `❌ ${data.error}`, 'error');
        }

    } catch (error) {
        showResult('approveResult', `❌ Error: ${error.message}`, 'error');
    }
}

// ================= VERIFY GUEST =================
async function verifyGuest() {
    const passCode = document.getElementById('passCode').value;

    if (!passCode) {
        showResult('verifyResult', '❌ Please enter passcode', 'error');
        return;
    }

    try {
        const response = await authenticatedFetch(`${BASE_URL}/api/v2/guests/verify`, {
            method: 'POST',
            body: JSON.stringify({ passCode })
        });

        if (!response) return;

        const data = await response.json();

        if (data.success) {
            showResult('verifyResult',
                `✅ Guest verified!\n\n👤 ${data.guest.name}`,
                'success'
            );
            document.getElementById('passCode').value = '';
        } else {
            showResult('verifyResult', `❌ ${data.error}`, 'error');
        }

    } catch (error) {
        showResult('verifyResult', `❌ Error: ${error.message}`, 'error');
    }
}

// ================= UI HELPERS =================
function showResult(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = type;
}

function clearForm() {
    document.getElementById('residentId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('purpose').value = '';
}