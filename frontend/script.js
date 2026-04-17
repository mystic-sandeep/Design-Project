// Sample data
let statsData = {
  totalGuests: 4,
  approvedToday: 4,
  pending: 0,
  verified: 4
};

// ============= LOGIN FLOW =============

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    if (!email) {
        showLoginError("Email required");
        return;
    }
    
    const result = await jwtLogin(email, password, role);
    
    if (result.success) {
        // Hide login, show app
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        // Show user info
        document.getElementById('userEmail').textContent = result.user.email;
        document.getElementById('userRole').textContent = result.user.role;
        
        updateStats(); // Load dashboard
        console.log("✅ Dashboard loaded");
    } else {
        showLoginError(result.message);
    }
}

function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        logout();
    }
}

function showLoginError(message) {
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

// ============= DASHBOARD FUNCTIONS =============

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Check if already logged in
  const storedToken = getStoredToken();
  if (storedToken) {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRole').textContent = currentUser.role;
    updateStats();
  }
});

function updateStats() {
  const statsDiv = document.getElementById('stats');
  statsDiv.innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${statsData.totalGuests}</div>
      <div class="stat-label">Total Guests</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${statsData.approvedToday}</div>
      <div class="stat-label">Approved Today</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${statsData.pending}</div>
      <div class="stat-label">Pending</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${statsData.verified}</div>
      <div class="stat-label">Verified Today</div>
    </div>
  `;
}

function showApprove() {
  hideAllSections();
  document.getElementById('approveSection').classList.remove('hidden');
}

function showVerify() {
  hideAllSections();
  document.getElementById('verifySection').classList.remove('hidden');
}

function hideAllSections() {
  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('hidden');
  });
}

// ============= API CALLS WITH JWT =============

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
    // Use secured endpoint with JWT
    const response = await authenticatedFetch('/api/v1/guests/approve', {
      method: 'POST',
      body: JSON.stringify({ residentId, name, phone, purpose })
    });
    
    if (!response) return; // Token expired
    
    const data = await response.json();
    
    if (data.success) {
      showResult('approveResult', `✅ Guest "${name}" approved!\n\n📝 Pass Code: ${data.passCode}\n\n🔐 Requested by: ${data.requestedBy}`, 'success');
      statsData.approvedToday++;
      statsData.totalGuests++;
      updateStats();
      clearForm();
    } else {
      showResult('approveResult', `❌ ${data.error}`, 'error');
    }
  } catch (error) {
    showResult('approveResult', `❌ Error: ${error.message}`, 'error');
  }
}

async function verifyGuest() {
  const passCode = document.getElementById('passCode').value;
  
  if (!passCode) {
    showResult('verifyResult', '❌ Please enter passcode', 'error');
    return;
  }
  
  try {
    // Use secured endpoint with JWT
    const response = await authenticatedFetch('/api/v1/guests/verify', {
      method: 'POST',
      body: JSON.stringify({ passCode })
    });
    
    if (!response) return; // Token expired
    
    const data = await response.json();
    
    if (data.success) {
      showResult('verifyResult', `✅ Guest entry verified successfully!\n\n👤 Guest: ${data.guest.name}\n🔐 Verified by: ${data.verifiedBy}`, 'success');
      statsData.verified++;
      updateStats();
      document.getElementById('passCode').value = '';
    } else {
      showResult('verifyResult', `❌ ${data.error}`, 'error');
    }
  } catch (error) {
    showResult('verifyResult', `❌ Error: ${error.message}`, 'error');
  }
}

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