function getRoleFromToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).role;
}

function routeToDashboard() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }
    const role = getRoleFromToken(token);
    
    // Case-insensitive routing fix
    const dashboardRoutes = {
        'admin': '/dashboards/admin.html',
        'resident': '/dashboards/resident.html',
        'guard': '/dashboards/guard.html',
        'staff': '/dashboards/staff.html',
        'maid': '/dashboards/maid.html'
    };
    window.location.href = dashboardRoutes[role.toLowerCase()] || '../index.html';
}

function logout() {
    localStorage.removeItem('jwt_token');
    window.location.href = '../index.html';
}

function authenticatedFetch(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('jwt_token');
    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return fetch(`http://localhost:8080/api/v2${endpoint}`, options)
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                logout();
            }
            return response.json();
        });
}