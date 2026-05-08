const BASE_URL = "http://localhost:8080";

let statsData = {
  totalGuests: 0,
  approvedToday: 0,
  pending: 0,
  verified: 0,
};

function updateStats() {
  document.getElementById("stats").innerHTML = `
    <div class="stat-card"><div>${statsData.totalGuests}</div><div>Total</div></div>
    <div class="stat-card"><div>${statsData.approvedToday}</div><div>Approved</div></div>
    <div class="stat-card"><div>${statsData.pending}</div><div>Pending</div></div>
  `;
}

// REGISTER
async function registerVisitor() {
  const visitorName = document.getElementById("visitorName").value;
  const apartment = document.getElementById("apartment").value;

  try {
    const res = await fetch(`${BASE_URL}/api/v2/guard/register-visitor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorName, apartmentNumber: apartment }),
    });

    const data = await res.json();

    alert("Passcode: " + data.data.passCode);

    statsData.totalGuests++;
    statsData.pending++;
    updateStats();

    loadVisitors();
  } catch (e) {
    alert("Error");
  }
}

// APPROVE
async function approveVisitor() {
  const passCode = prompt("Enter Passcode");

  const res = await fetch(`${BASE_URL}/api/v2/resident/approve-visitor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passCode }),
  });

  const data = await res.json();

  alert(data.message);

  statsData.approvedToday++;
  statsData.pending--;
  updateStats();

  loadVisitors();
}

// LOAD VISITORS
async function loadVisitors() {
  const res = await fetch(`${BASE_URL}/api/v2/admin/visitors`);
  const data = await res.json();

  const table = document.getElementById("visitorTable");
  table.innerHTML = "";

  data.data.visitors.forEach((v, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${v.visitor_name}</td>
        <td>${v.apartment_number}</td>
        <td>${v.status}</td>
      </tr>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  loadVisitors();
});
