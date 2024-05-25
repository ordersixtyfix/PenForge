document.addEventListener('DOMContentLoaded', () => {
    const targets = [
        { target: 'https://www.winspears.com', type: 'URL', ip: '192.168.1.1', scans: 1 },
        { target: 'http://www.aucklandzoo.co.nz', type: 'URL', ip: '192.168.1.2', scans: 1 },
        { target: 'http://www.ntu.edu.sg', type: 'URL', ip: '192.168.1.3', scans: 1 },
        { target: 'https://www.prometric.com', type: 'URL', ip: '192.168.1.4', scans: 1 },
        { target: 'http://www.didatec.ro', type: 'URL', ip: '192.168.1.5', scans: 1 },
        { target: 'https://www.drupal.org', type: 'URL', ip: '192.168.1.6', scans: 1 },
        { target: 'protv.ro', type: 'Hostname', ip: '192.168.1.7', scans: 1 },
        { target: 'instalgaz.ro', type: 'Hostname', ip: '192.168.1.8', scans: 3 },
        { target: 'vodafone.ro', type: 'Hostname', ip: '192.168.1.9', scans: 1 },
        { target: 'orange.ro', type: 'Hostname', ip: '192.168.1.10', scans: 4 },
        { target: 'http://www.instalgaz.ro', type: 'URL', ip: '192.168.1.11', scans: 1 },
        { target: 'http://orange.ro', type: 'URL', ip: '192.168.1.12', scans: 1 },
        { target: 'http://aqfood.org', type: 'URL', ip: '192.168.1.13', scans: 1 },
        { target: 'https://uproarteam.com', type: 'URL', ip: '192.168.1.14', scans: 2 }
    ];

    const tableBody = document.querySelector('table tbody');

    const renderTable = () => {
        tableBody.innerHTML = '';
        targets.forEach((target, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${target.target}</td>
                <td>${target.type}</td>
                <td>${target.ip}</td>
                <td>${target.scans}</td>
                <td>
                    <button class="action-button test-button" data-index="${index}">Test</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    };

    renderTable();

    // Event delegation for test buttons
    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('test-button')) {
            const index = event.target.getAttribute('data-index');
            // Add test functionality here
            alert(`Testing target: ${targets[index].target}`);
        }
    });
});
