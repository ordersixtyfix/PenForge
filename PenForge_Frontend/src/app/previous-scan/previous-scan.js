document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('userDto');
    window.location.href = '../login/login.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const scanInfo = document.getElementById("scan-info");
    scanInfo.innerText = "Tarama sonuçları yükleniyor...";

    class PreviousScan {
        constructor() {
            this.scans = [];
            this.currentPage = 1;
            this.itemsPerPage = 10;
            this.totalPages = 1;
        }

        addScan(targetIP, scanDate, targetPort) {
            this.scans.push({
                targetIP: targetIP,
                scanDate: scanDate,
                targetPort: targetPort
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
                const row = `
                    <tr>
                        <td>${scan.targetIP}</td>
                        <td>${scan.scanDate}</td>
                        <td>${scan.targetPort}</td>
                        <td>
                            <a href="#" class="nav-icon">
                                <img src="../../assets/icons/repeat.png" alt="Tekrarla">
                            </a>
                            <a href="#" class="nav-icon">
                                <img src="../../assets/icons/download.png" alt="İndir">
                            </a>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
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
    }

    const previousScan = new PreviousScan();

    const userDtoString = localStorage.getItem('userDto');
    if (userDtoString) {
        try {
            const userDto = JSON.parse(userDtoString);
            if (userDto && userDto.userId) {
                fetch(`http://localhost:8888/api/v1/past-reports?userId=${userDto.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 200 && data.data) {
                            data.data.forEach(report => {
                                previousScan.addScan(report.targetIP, report.scanDate, report.targetPort);
                            });
                            previousScan.renderScans();
                        } else {
                            scanInfo.innerText = "Tarama sonuçları bulunamadı.";
                        }
                    })
                    .catch(error => {
                        console.error('Hata:', error);
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
