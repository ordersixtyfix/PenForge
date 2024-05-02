document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('vulnerabilityHistoryChart').getContext('2d');
    var vulnerabilityHistoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Düşük', 'Orta', 'Yüksek', 'Kritik'],
            datasets: [{
                label: 'Vulnerability History',
                data: [30, 32, 26, 12],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var ctx2 = document.getElementById('vulnerabilityCategoryChart').getContext('2d');
    var vulnerabilityCategoryChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'Insecure Deserialization', 'Broken Authentication', 'Sensitive Data Exposure'],
            datasets: [{
                label: 'Vulnerability by Category',
                data: [15, 10, 8, 12, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    // Yeni bir pasta grafiği ekleyelim (sadece kontrol amacıyla)
    var ctx3 = document.getElementById('pieChart').getContext('2d');
    var pieChart = new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: ['Kritik', 'Yüksek', 'Orta', 'Düşük'],
            datasets: [{
                label: 'Vulnerability Pie Chart',
                data: [12, 26, 32, 30],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.2)', // Kritik
                    'rgba(255, 99, 132, 0.2)', // Yüksek
                    'rgba(255, 206, 86, 0.2)', // Orta
                    'rgba(54, 162, 235, 0.2)' // Düşük
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)', // Kritik
                    'rgba(255, 99, 132, 1)', // Yüksek
                    'rgba(255, 206, 86, 1)', // Orta
                    'rgba(54, 162, 235, 1)' // Düşük
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    // Mock rapor verileri
    const reportsData = [
        { date: "2024-05-01", status: "Tamamlandı" },
        { date: "2024-04-30", status: "Tamamlandı" },
        // Diğer raporlar buraya eklenebilir
    ];

    // Tabloya raporları ekleme
    const tableBody = document.getElementById("report-table-body");
    reportsData.forEach(report => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${report.date}</td>
            <td>${report.status}</td>
            <td><a href="#">Rapor Detayı</a></td>
        `;
        tableBody.appendChild(row);
    });
});

