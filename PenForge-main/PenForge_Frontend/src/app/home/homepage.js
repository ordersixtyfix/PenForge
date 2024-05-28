document.getElementById('logoutButton').addEventListener('click', async function () {
    const response = await window.electronAPI.logout();
    if (response.error) {
        alert("Çıkış işlemi sırasında bir hata oluştu: " + response.error);
    } else if (response.code === 200) {
        alert("Oturum başarıyla kapatıldı.");
        window.location.href = 'login.html';
    } else {
        alert("Çıkış işlemi sırasında beklenmeyen bir hata oluştu.");
    }
});

// Fetch user data from the server
async function fetchUserData() {
    try {
        const response = await fetch('/api/user');
        const user = await response.json();
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('profile-pic').src = user.profilePicture;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Call the function to fetch and display user data
fetchUserData();

// Example chart initialization code
const ctxVulnerabilityPortDistribution = document.getElementById('vulnerabilityPortDistributionChart').getContext('2d');
const vulnerabilityPortDistributionChart = new Chart(ctxVulnerabilityPortDistribution, {
    type: 'bar',
    data: {
        labels: ['HTTP/HTTPS', 'SMTP', 'FTP', 'SSH', 'SMB', 'DNS', 'Telnet', 'TFTP'],
        datasets: [{
            label: 'Zaafiyetli Portların Dağılımı',
            data: [12, 19, 3, 5, 2, 3, 7, 8],
            backgroundColor: ['#1B5D85', '#FC273F', '#FF9F40', '#9B59B6', '#4BC0C0', '#FFCE56', '#E7E9ED', '#011520'],
            hoverBackgroundColor: ['#1B5D85', '#FC273F', '#FF9F40', '#9B59B6', '#4BC0C0', '#FFCE56', '#E7E9ED', '#011520']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'null',
            },
            title: {
                display: true,
                text: 'Zaafiyetli Portların Dağılımı'
            }
        }
    }
});

const ctxPortStatus = document.getElementById('portStatusChart').getContext('2d');
const portStatusChart = new Chart(ctxPortStatus, {
    type: 'pie',
    data: {
        labels: ['Open', 'Filtered', 'Closed'],
        datasets: [{
            label: 'Port Durumları',
            data: [45, 25, 30],
            backgroundColor: ['#1B5D85', '#FC273F', '#FFCE56'],
            hoverBackgroundColor: ['#1B5D85', '#FC273F', '#FFCE56']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Port Durumları'
            }
        }
    }
});
