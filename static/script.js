// Staff Management
document.addEventListener('DOMContentLoaded', function() {
    // Record Staff Exit
    document.querySelectorAll('.record-exit').forEach(button => {
        button.addEventListener('click', function() {
            const staffId = this.dataset.id;
            const staffName = this.dataset.name;
            
            if (confirm(`Record exit for ${staffName}?`)) {
                fetch('/staff_exit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({staff_id: staffId})
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });
            }
        });
    });

    // Update staff inside count
    updateStaffCount();
});

function updateStaffCount() {
    const insideCount = document.querySelectorAll('tr td .badge.bg-success').length;
    document.getElementById('staffInsideCount').textContent = insideCount;
}

// Patrol Management
let currentStream = null;

function startScanner() {
    const video = document.getElementById('qrVideo');
    const container = document.getElementById('qrScanner');
    const manualScan = document.getElementById('manualScan');
    
    container.style.display = 'block';
    manualScan.style.display = 'none';
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            startQRDetection();
        })
        .catch(err => {
            alert('Camera access denied. Use manual scan.');
            container.style.display = 'none';
            manualScan.style.display = 'block';
        });
}

function startQRDetection() {
    // Simple QR detection simulation (use jsQR library for production)
    setTimeout(() => {
        const result = document.getElementById('scanResult');
        result.innerHTML = '<div class="alert alert-success">QR Scanned Successfully! Checkpoint logged.</div>';
        stopScanner();
        loadPatrolLogs();
    }, 2000);
}

function stopScanner() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
}

// Patrol form submission
document.getElementById('manualPatrolForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    fetch('/patrol', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Patrol checkpoint recorded!');
            this.reset();
            loadPatrolLogs();
            updatePatrolStats();
        }
    });
});

function loadPatrolLogs() {
    fetch('/patrol_logs')
        .then(response => response.json())
        .then(logs => {
            const tbody = document.getElementById('patrolLogs');
            tbody.innerHTML = logs.map(log => `
                <tr>
                    <td>${log.guard_id}</td>
                    <td>${log.checkpoint_name}</td>
                    <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td>${log.gps_location || 'N/A'}</td>
                </tr>
            `).join('');
        });
}

function updatePatrolStats() {
    // Update stats via AJAX
    fetch('/patrol_stats')
        .then(response => response.json())
        .then(stats => {
            document.getElementById('checkpointsCompleted').textContent = stats.completed;
            document.getElementById('patrolStatus').textContent = stats.status;
        });
}

// Device Management
document.querySelectorAll('.device-control').forEach(button => {
    button.addEventListener('click', function() {
        const deviceId = this.dataset.id;
        const action = this.dataset.action;
        const button = this;
        
        fetch('/control_device', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: deviceId,
                action: action
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    });
});

// Add Device Form
document.getElementById('addDeviceForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    fetch('/add_device', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('addDeviceModal')).hide();
            location.reload();
        }
    });
});