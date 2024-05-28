document.addEventListener("DOMContentLoaded", function () {
    // Tarama sonuçları yükleniyor mesajı (Daha sonra güncellenecek)
    const scanInfo = document.getElementById("scan-info");
    scanInfo.innerText = "Tarama sonuçları yükleniyor...";

    // PreviousScan sınıfını oluştur
    class PreviousScan {
        constructor() {
            this.scans = []; // Tarama sonuçlarını depolamak için bir dizi
            this.currentPage = 1; // Şu anki sayfa numarası
            this.itemsPerPage = 10; // Sayfa başına gösterilecek öğe sayısı
            this.totalPages = 1; // Toplam sayfa sayısı
        }

        // Tarama sonuçlarını ekleyen method
        addScan(target, startTime, result, vulnerability = null) {
            this.scans.push({
                target: target,
                startTime: startTime,
                result: result,
                vulnerability: vulnerability
            });
        }

        // Tarama sonuçlarını tabloya dolduran method
        renderScans() {
            const tbody = document.querySelector(".scan-table tbody");
            tbody.innerHTML = ""; // Tabloyu temizle

            // Sayfalandırma hesaplamalarını yap
            this.totalPages = Math.ceil(this.scans.length / this.itemsPerPage);

            // Gösterilecek başlangıç ve bitiş indekslerini hesapla
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            let endIndex = startIndex + this.itemsPerPage;
            if (endIndex > this.scans.length) {
                endIndex = this.scans.length;
            }

            // Tabloya sonuçları ekle
            for (let i = startIndex; i < endIndex; i++) {
                const scan = this.scans[i];
                const row = `
                    <tr>
                        <td><a href="${scan.target}">${scan.target}</a></td>
                        <td>${scan.startTime}</td>
                        <td class="${scan.result === 'Başarılı' ? 'success' : 'failed'}">${scan.result}${scan.vulnerability ? ` (${scan.vulnerability})` : ''}</td>
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

            // Tarama sonuçları yükleniyor mesajını güncelle
            scanInfo.innerText = `Toplam ${this.scans.length} sonuç bulundu. ${startIndex + 1} ve ${endIndex} aralığı gösteriliyor...`;

            // Sayfalama düğmelerini oluştur
            this.renderPagination();
        }

        // Sayfalama düğmelerini oluşturan method
        renderPagination() {
            const pagination = document.querySelector(".pagination");
            pagination.innerHTML = ""; // Sayfalama düğmelerini temizle

            // Sayfalama düğmelerini oluştur
            for (let i = 1; i <= this.totalPages; i++) {
                const button = document.createElement("button");
                button.textContent = i;
                button.classList.add("pagination-button");
                button.addEventListener("click", () => {
                    this.currentPage = i;
                    this.renderScans(); // Yeni sayfa ile tarama sonuçlarını yeniden doldur
                });
                pagination.appendChild(button);
            }
        }
    }

    // Örnek bir PreviousScan objesi oluştur
    const previousScan = new PreviousScan();

    // Örnek tarama sonuçları ekle
    previousScan.addScan("https://www.google.com/", "06.05.2024 23:36", "Başarılı", "XSS Açığı");
    previousScan.addScan("https://www.example.com/", "06.05.2024 23:50", "Başarısız");
    previousScan.addScan("https://www.github.com/", "07.05.2024 12:45", "Başarılı", "CSRF Açığı");
    previousScan.addScan("https://www.linkedin.com/", "07.05.2024 15:20", "Başarısız");
    previousScan.addScan("https://www.facebook.com/", "08.05.2024 09:10", "Başarılı", "Sensitive Data Exposure");
    previousScan.addScan("https://www.twitter.com/", "08.05.2024 14:30", "Başarısız");
    previousScan.addScan("https://www.amazon.com/", "09.05.2024 08:55", "Başarılı", "XML External Entities (XXE)");
    previousScan.addScan("https://www.apple.com/", "09.05.2024 10:25", "Başarısız");
    previousScan.addScan("https://www.microsoft.com/", "10.05.2024 11:40", "Başarılı", "Insufficient Logging & Monitoring");
    previousScan.addScan("https://www.netflix.com/", "10.05.2024 13:15", "Başarısız");
    previousScan.addScan("https://www.spotify.com/", "11.05.2024 15:05", "Başarılı", "Insufficient Attack Protection");
    previousScan.addScan("https://www.udemy.com/", "11.05.2024 17:20", "Başarısız");
    previousScan.addScan("https://www.youtube.com/", "12.05.2024 09:30", "Başarılı", "Insecure API");
    previousScan.addScan("https://www.netflix.com/", "12.05.2024 11:55", "Başarısız");
    previousScan.addScan("https://www.spotify.com/", "13.05.2024 14:10", "Başarılı", "Insecure Data Storage");
    previousScan.addScan("https://www.udemy.com/", "13.05.2024 16:45", "Başarısız");


    // Tarama sonuçlarını tabloya doldur
    previousScan.renderScans();
});
