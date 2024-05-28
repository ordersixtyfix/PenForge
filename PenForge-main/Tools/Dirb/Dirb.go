package main

import (
	"bufio"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

func main() {

	var targetURL string
	var wordlistPath string
	var report bool
	var reportFileName string
	var scanLargeFiles bool

	// Kullanıcıdan hedef URL adresi, wordlist yolu, tarama seçeneği ve rapor isteğini al
	fmt.Print("Hedef URL adresini girin: ")
	fmt.Scanln(&targetURL)
	fmt.Print("Wordlist dosyasının yolunu girin: ")
	fmt.Scanln(&wordlistPath)
	fmt.Print("Sadece 20KB'dan büyük dosyaları taramak ister misiniz? (Evet için true/false): ")
	fmt.Scanln(&scanLargeFiles)
	fmt.Print("Sonuçları raporlamak ister misiniz? (Evet için true/false): ")
	fmt.Scanln(&report)

	if report {
		fmt.Print("Rapor dosyasının adını girin: ")
		fmt.Scanln(&reportFileName)
	}

	startTime := time.Now()

	// Wordlist dosyasını aç
	wordlistFile, err := os.Open(wordlistPath)
	if err != nil {
		fmt.Println("Wordlist dosyasını açarken hata oluştu:", err)
		return
	}
	defer wordlistFile.Close()

	if report {
		// Rapor dosyasını aç
		reportFile, err := os.Create(reportFileName + ".txt")
		if err != nil {
			fmt.Println("Rapor dosyasını oluştururken hata oluştu:", err)
			return
		}
		defer reportFile.Close()

		// Başlangıç zamanını rapora ekle
		reportFile.WriteString("--------------------------------------------------\n")
		reportFile.WriteString("	Web Searcher From PenForge ST\n")
		reportFile.WriteString("--------------------------------------------------\n")
		reportFile.WriteString(fmt.Sprintf("OUTPUT_FILE: %s\n", reportFileName+".txt"))
		reportFile.WriteString(fmt.Sprintf("START_TIME: %s\n", startTime.Format("2006-01-02 15:04:05")))
		reportFile.WriteString(fmt.Sprintf("URL_BASE: %s\n", targetURL))
		reportFile.WriteString(fmt.Sprintf("WORDLIST_FILE: %s\n", wordlistPath))
		reportFile.WriteString(fmt.Sprintf("Scan_Large_Files: %v\n", scanLargeFiles))
		reportFile.WriteString("--------------------------------------------------\n")

		// Her bir wordlist girişini oku ve tarama yap
		scanner := bufio.NewScanner(wordlistFile)
		var urls []string
		for scanner.Scan() {
			word := scanner.Text()
			url := targetURL + "/" + word
			urls = append(urls, url)
		}

		if err := scanner.Err(); err != nil {
			fmt.Println("Wordlist dosyasını okurken hata oluştu:", err)
			return
		}

		// Paralel tarama yap
		foundExtensions := parallelScan(urls, report, reportFile, scanLargeFiles, startTime)

		// Bulunan uzantıları rapora ekle
		reportFile.WriteString("--------------------------------------------------\n")
		if len(foundExtensions) == 0 {
			if scanLargeFiles {
				reportFile.WriteString("20 KB'dan büyük dosya bulunamadı.\n")
			} else {
				reportFile.WriteString("20 KB'dan küçük dosya bulunamadı.\n")
			}
		} else {
			reportFile.WriteString("Found Extensions:")
			for extension, size := range foundExtensions {
				reportFile.WriteString(fmt.Sprintf("%s - Size: %d bytes\n", extension, size))
			}
		}

		// Bitiş zamanını rapora ekle
		endTime := time.Now()
		duration := endTime.Sub(startTime)
		reportFile.WriteString("--------------------------------------------------\n")
		reportFile.WriteString(fmt.Sprintf("End_Time: %s\n", endTime.Format("2006-01-02 15:04:05")))
		reportFile.WriteString(fmt.Sprintf("Total Time: %s\n", duration))
		reportFile.WriteString(fmt.Sprintf("URLs Found: %d\n", len(foundExtensions)))
		reportFile.WriteString("--------------------------------------------------\n")
	} else {
		// Raporlamayı istemediği durumda rapor dosyası oluşturma
		fmt.Println("Sonuçları raporlamak istemediğiniz için rapor dosyası oluşturulmayacak.")
		// Her bir wordlist girişini oku ve tarama yap
		scanner := bufio.NewScanner(wordlistFile)
		var urls []string
		for scanner.Scan() {
			word := scanner.Text()
			url := targetURL + "/" + word
			urls = append(urls, url)
		}

		if err := scanner.Err(); err != nil {
			fmt.Println("Wordlist dosyasını okurken hata oluştu:", err)
			return
		}

				// Paralel tarama yap
		parallelScan(urls, report, nil, scanLargeFiles, startTime)

		// Bitiş zamanını yaz
		endTime := time.Now()
		duration := endTime.Sub(startTime)
		fmt.Println("Toplam Süre:", duration)
	}
}

// Belirtilen URL'yi kontrol et
func checkURL(url string) (bool, string, int64) {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("[%s] Hata: %v\n", url, err)
		return false, "", 0
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		fmt.Printf("[\033[1;32m%s\033[0m] [\033[1;32mBulundu\033[0m] !\n", url)
		extension := getFileExtension(url)
		return true, extension, resp.ContentLength
	}
	return false, "", 0
}

// Dosya uzantısını alma fonksiyonu
func getFileExtension(url string) string {
	parts := strings.Split(url, "/")
	filename := parts[len(parts)-1]
	if strings.Contains(filename, ".") {
		ext := strings.Split(filename, ".")
		return ext[len(ext)-1]
	}
	return ""
}

// Paralel tarama yap
func parallelScan(urls []string, report bool, reportFile *os.File, scanLargeFiles bool, startTime time.Time) map[string]int64 {
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 10) // Paralel olarak 10 tarama yap

	foundExtensions := make(map[string]int64)

	for _, url := range urls {
		semaphore <- struct{}{}
		wg.Add(1)
		go func(u string) {
			defer wg.Done()
			found, extension, size := checkURL(u)
			if found {
				if scanLargeFiles {
					if size > 20*1024 { // 20 KB'dan büyük dosyaları tara
						if report {
							reportFile.WriteString(fmt.Sprintf("Generated Word: %s - Size: %d bytes\n", u, size))
						}
						foundExtensions[extension] = size
					}
				} else {
					if size <= 20*1024 { // 20 KB'dan küçük dosyaları tara
						if report {
							reportFile.WriteString(fmt.Sprintf("Generated Word: %s - Size: %d bytes\n", u, size))
						}
						foundExtensions[extension] = size
					}
				}
			}
			<-semaphore
		}(url)
	}

	wg.Wait()

	return foundExtensions
}

