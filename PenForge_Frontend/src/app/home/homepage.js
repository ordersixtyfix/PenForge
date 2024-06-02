document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('userDto'); // userDto'yu localStorage'dan kaldır
    window.location.href = '../login/login.html'; // Giriş sayfasına yönlendir
});

const userDtoString = localStorage.getItem('userDto');

const fetchStatistics = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8888/api/v1/statistics?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateCharts(data.data); // Pass the data to the chart updating function
        updateMetrics(data.data); // Update the metrics section with the received data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

const updateMetrics = (data) => {
    document.getElementById('totalTargets').textContent = data.totalTargets;
    document.getElementById('vulnerableTargets').textContent = data.vulnerableTargets;
    document.getElementById('totalOpenPorts').textContent = data.totalOpenPorts;
    document.getElementById('totalTests').textContent = data.totalTests;
};

const updateCharts = (data) => {
    const ctxVulnerabilityPortDistribution = document.getElementById('vulnerabilityPortDistributionChart').getContext('2d');
    const vulnerabilityPortDistributionChart = new Chart(ctxVulnerabilityPortDistribution, {
        type: 'bar',
        data: {
            labels: ['HTTP/HTTPS', 'SMTP', 'FTP', 'SSH', 'SMB', 'DNS', 'Telnet', 'TFTP'],
            datasets: [{
                label: 'Zaafiyetli Portların Dağılımı',
                data: [
                    data.openPorts.http,
                    data.openPorts.smtp,
                    data.openPorts.ftp,
                    data.openPorts.ssh,
                    data.openPorts.smb,
                    data.openPorts.dns,
                    data.openPorts.telnet,
                    data.openPorts.tftp
                ],
                backgroundColor: ['#1B5D85', '#FC273F', '#FF9F40', '#9B59B6', '#4BC0C0', '#FFCE56', '#E7E9ED', '#21E3C2FF'],
                hoverBackgroundColor: ['#1B5D85', '#FC273F', '#FF9F40', '#9B59B6', '#4BC0C0', '#FFCE56', '#E7E9ED', '#21E3C2FF']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
            labels: ['Açık', 'Filtreli', 'Kapalı'],
            datasets: [{
                label: 'Port Durumları',
                data: [
                    data.portStatus.open,
                    data.portStatus.filtered,
                    data.portStatus.closed
                ],
                backgroundColor: ['#12afe8', '#FC273F', '#FFCE56'],
                hoverBackgroundColor: ['#12afe8', '#FC273F', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
};

document.addEventListener('DOMContentLoaded', (event) => {
    if (userDtoString) {
        try {
            const userDto = JSON.parse(userDtoString);
            if (userDto) {
                document.getElementById('user-name').textContent = `${userDto.firstName} ${userDto.lastName}`;
                const profileImage = document.getElementById('profile-pic');
                if (userDto.profileImage) {
                    profileImage.src = userDto.profileImage;
                }
                document.getElementById('profile-container').classList.add('loaded');

                // Fetch statistics with userId
                fetchStatistics(userDto.id);
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

document.addEventListener('DOMContentLoaded', (event) => {
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
    }
});
