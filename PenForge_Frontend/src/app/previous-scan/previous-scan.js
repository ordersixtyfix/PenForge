document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('userDto');
    window.location.href = '../login/login.html';
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 aralığında olduğu için 1 ekliyoruz
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM yüklendi");

    const scanInfo = document.getElementById("scan-info");
    scanInfo.innerText = "Tarama sonuçları yükleniyor...";

    class PreviousScan {
        constructor() {
            this.scans = [];
            this.currentPage = 1;
            this.itemsPerPage = 10;
            this.totalPages = 1;
        }

        addScan(targetIP, scanDate, targetPort, reportId) {
            this.scans.push({
                targetIP: targetIP,
                scanDate: formatDate(scanDate),
                targetPort: targetPort,
                reportId: reportId
            });
        }

        renderScans() {
            const tbody = document.querySelector(".scan-table tbody");
            tbody.innerHTML = "";

            this.totalPages = Math.ceil(this.scans.length / this.itemsPerPage);

            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            let endIndex = startIndex + this.itemsPerPage;
            if (endIndex > this.scans.length) {
                endIndex = this.scans.length;
            }

            for (let i = startIndex; i < endIndex; i++) {
                const scan = this.scans[i];
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${scan.targetIP}</td>
                    <td>${scan.scanDate}</td>
                    <td>${scan.targetPort}</td>
                    <td>
                        <a href="#" class="nav-icon download-report">
                            <img src="../../assets/icons/download-icon.png" alt="İndir">
                        </a>
                    </td>
                `;
                row.querySelector(".download-report").addEventListener("click", () => {
                    this.downloadReport(scan.reportId);
                });
                tbody.appendChild(row);
            }

            scanInfo.innerText = `Toplam ${this.scans.length} sonuç bulundu. ${startIndex + 1} ve ${endIndex} aralığı gösteriliyor...`;

            this.renderPagination();
        }

        renderPagination() {
            const pagination = document.querySelector(".pagination");
            pagination.innerHTML = "";

            for (let i = 1; i <= this.totalPages; i++) {
                const button = document.createElement("button");
                button.textContent = i;
                button.classList.add("pagination-button");
                button.addEventListener("click", () => {
                    this.currentPage = i;
                    this.renderScans();
                });
                pagination.appendChild(button);
            }
        }

        downloadReport(reportId) {
            const userDtoString = localStorage.getItem('userDto');
            if (userDtoString) {
                try {
                    const userDto = JSON.parse(userDtoString);
                    if (userDto && userDto.id) {
                        fetch(`http://localhost:8888/api/v1/report-generate`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ reportId: reportId })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok ' + response.statusText);
                                }
                                return response.blob();
                            })
                            .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = `report_${reportId}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                            })
                            .catch(error => {
                                console.error('Fetch error:', error);
                            });
                    }
                } catch (e) {
                    console.error('Invalid JSON in local storage:', e);
                }
            } else {
                console.log('Kullanıcı bilgileri bulunamadı');
            }
        }
    }

    const previousScan = new PreviousScan();

    const userDtoString = localStorage.getItem('userDto');
    if (userDtoString) {
        console.log("userDto bulundu:", userDtoString);
        try {
            const userDto = JSON.parse(userDtoString);
            if (userDto && userDto.id) {
                console.log(`User ID: ${userDto.id}`);
                fetch(`http://localhost:8888/api/v1/past-reports?userId=${userDto.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        console.log('Response received:', response);
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Data received:', data);
                        if (data.code === 200 && data.data) {
                            data.data.forEach(report => {
                                previousScan.addScan(report.targetIP, report.scanDate, report.targetPort, report.id);
                            });
                            previousScan.renderScans();
                        } else {
                            scanInfo.innerText = "Tarama sonuçları bulunamadı.";
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        scanInfo.innerText = "Tarama sonuçları yüklenirken bir hata oluştu.";
                    });
            }
        } catch (e) {
            console.error('Invalid JSON in local storage:', e);
        }
    } else {
        console.log('Kullanıcı bilgileri bulunamadı');
        scanInfo.innerText = "Kullanıcı bilgileri bulunamadı.";
    }
});
