// Sample data
let statsData = {
  totalGuests: 4,
  approvedToday: 4,
  pending: 0,
  verified: 4
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateStats();
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

function approveGuest() {
  const residentId = document.getElementById('residentId').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const purpose = document.getElementById('purpose').value;
  
  if (!residentId || !name || !phone) {
    showResult('approveResult', 'Please fill all required fields', 'error');
    return;
  }
  
  // Simulate API call
  setTimeout(() => {
    showResult('approveResult', `✅ Guest "${name}" approved for ${purpose}! Passcode: ${Math.floor(100000 + Math.random() * 900000)}`, 'success');
    statsData.approvedToday++;
    statsData.totalGuests++;
    updateStats();
    clearForm();
  }, 1000);
}

function verifyGuest() {
  const passCode = document.getElementById('passCode').value;
  
  if (!passCode) {
    showResult('verifyResult', 'Please enter passcode', 'error');
    return;
  }
  
  // Simulate verification
  setTimeout(() => {
    if (passCode.length === 6) {
      showResult('verifyResult', '✅ Guest entry verified successfully!', 'success');
      statsData.verified++;
      updateStats();
      document.getElementById('passCode').value = '';
    } else {
      showResult('verifyResult', '❌ Invalid passcode', 'error');
    }
  }, 800);
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