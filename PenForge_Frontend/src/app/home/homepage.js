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

// Example chart initialization code
const ctxVulnerabilityPortDistribution = document.getElementById('vulnerabilityPortDistributionChart').getContext('2d');
const vulnerabilityPortDistributionChart = new Chart(ctxVulnerabilityPortDistribution, {
    type: 'bar',
    data: {
        labels: ['HTTP/HTTPS', 'SMTP', 'FTP', 'SSH', 'SMB', 'DNS', 'Telnet', 'TFTP'],
        datasets: [{
            label: 'Zaafiyetli Portların Dağılımı',
            data: [12, 19, 3, 5, 2, 3, 7, 8],
            backgroundColor: ['#1B5D85', '#FC273F', '#FF9F40', '#9B59B6', '#4BC0C0', '#FFCE56', '#E7E9ED', '#21E3C2FF'],
            hoverBackgroundColor: ['#1B5D85', '#FC273F', '#FF9F40', '#9B59B6', '#4BC0C0', '#FFCE56', '#E7E9ED', '#21E3C2FF']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true, // Ekran oranını koruyacak şekilde ayarlanmıştır
        plugins: {
            legend: {
                position: 'null',
            },
            title: {
                display: false,
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
            backgroundColor: ['#12afe8', '#FC273F', '#FFCE56'],
            hoverBackgroundColor: ['#12afe8', '#FC273F', '#FFCE56']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true, // Ekran oranını koruyacak şekilde ayarlanmıştır
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            },
            title: {
                display: false,
                text: 'Port Durumları'
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const userDtoString = localStorage.getItem('userDto');

    if (userDtoString) {
        try {
            const userDto = JSON.parse(userDtoString);
            if (userDto) {
                document.getElementById('user-name').textContent = `${userDto.firstName} ${userDto.lastName}`;
                const profileImage = document.getElementById('profile-pic');
                if (userDto.profilePictureUrl) {
                    const imageUrl = `http://localhost:8888/api/v1/files/${userDto.profilePictureUrl}`;
                    console.log('Profile Image URL:', imageUrl); // Log the URL
                    profileImage.src = imageUrl;
                }
            }
        } catch (e) {
            console.error('Invalid JSON in local storage:', e);
        }
    } else {
        console.log('Kullanıcı bilgileri bulunamadı');
    }

    let ipAddresses = [];
    const tableBody = document.querySelector('.scan-table tbody');
    const scanInfo = document.getElementById("scan-info");

    const renderTable = () => {
        tableBody.innerHTML = '';
        const limitedIpAddresses = ipAddresses.slice(0, 5); // Limit to first 5 IP addresses

        limitedIpAddresses.forEach((ip) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ip}</td>
                <td><span class="status-dot"></span></td>
            `;
            tableBody.appendChild(row);
        });
    };

    const fetchIPAddresses = async () => {
        try {
            const response = await fetch('http://localhost:8888/api/v1/find-target');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            ipAddresses = data.data || [];
            renderTable();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    fetchIPAddresses();
});
