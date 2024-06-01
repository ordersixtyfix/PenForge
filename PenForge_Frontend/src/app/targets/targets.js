document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('userDto');
    window.location.href = '../login/login.html';
});

document.addEventListener('DOMContentLoaded', () => {
    let ipAddresses = [];

    const tableBody = document.querySelector('table tbody');

    const renderTable = () => {
        tableBody.innerHTML = '';

        ipAddresses.forEach((ip) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${ip}</td>
                <td>
                    <button class="action-button test-button" data-index="${ip}">Test</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    };

    const scanInfo = document.getElementById("scan-info");

    // Fetch IP addresses from the API
    const fetchIPAddresses = async () => {
        try {
            const response = await fetch('http://localhost:8888/api/v1/find-target');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            ipAddresses = data.data || []; // Update the ipAddresses array with data from the API
            scanInfo.innerText = `Toplam ${ipAddresses.length} sonuç bulundu.`;
            renderTable(); // Render the table with the fetched IP addresses
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            scanInfo.innerText = 'IP adresleri alınamadı.';
        }
    };

    fetchIPAddresses(); // Call the function to fetch IP addresses

    // Event delegation for test buttons
    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('test-button')) {
            const testIp = event.target.getAttribute('data-index');
            window.location.href = `../test-builder/test-builder.html?testIp=${testIp}`;
        }
    });
});

