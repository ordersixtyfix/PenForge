package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"strconv"
	"strings"
	"time"
	"bufio"
)

// PortScanner struct
type PortScanner struct {
	target    string
	openPorts map[int]string
}

// NewPortScanner creates a new PortScanner instance
func NewPortScanner(target string) *PortScanner {
	return &PortScanner{
		target:    target,
		openPorts: make(map[int]string),
	}
}

// CommonPorts returns a list of commonly used ports for quick scan
func CommonPorts() []int {
	return []int{21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 993, 995}
}

// ScanPort scans a single port
// loadServiceMapFromFile dosyadan servis haritasını yükler
func loadServiceMapFromFile(filename string) (map[int]string, error) {
	serviceMap := make(map[int]string)

	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)
		if len(fields) >= 2 {
			portNum, err := strconv.Atoi(fields[0])
			if err != nil {
				continue // Geçersiz satırı atla
			}
			serviceMap[portNum] = fields[1]
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return serviceMap, nil
}

// ScanPort scans a single port
func (ps *PortScanner) ScanPort(port int, scanVersions bool) int {
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ps.target, port), time.Second)
	if err != nil {
		return 1 // Port is closed
	}
	defer conn.Close()

	if scanVersions {
		// Servis haritasını dosyadan yükle
		serviceMap, err := loadServiceMapFromFile("services.txt")
		if err != nil {
			fmt.Println("Servis haritası yüklenirken hata oluştu:", err)
		} else {
			// Port numarasına karşılık gelen servis adını al (haritada bulunuyorsa)
			service, ok := serviceMap[port]
			if ok {
				ps.openPorts[port] = service // Servis adını kaydet
			} else {
				ps.openPorts[port] = "Unknown" // Bilinmeyen servis adını işaretle
			}
		}
	}

	return 0 // Port is open
}



// ScanAllPorts scans all ports
func (ps *PortScanner) ScanAllPorts(ports []int, scanVersions bool) []int {
	var openPorts []int
	for _, port := range ports {
		if ps.ScanPort(port, scanVersions) == 0 {
			openPorts = append(openPorts, port)
		}
	}
	return openPorts
}

// ScanResult represents the result of a port scan in JSON format
type ScanResult struct {
	TargetIP    string            `json:"target_ip"`
	ScanDate    time.Time         `json:"scan_date"`
	OpenPorts   map[int]string    `json:"open_ports"`
	ScanVersions bool              `json:"scan_versions"`
}

// writeScanResultToFile writes the scan result to a JSON file
func writeScanResultToFile(scanResult ScanResult) {
	file, err := os.Create("scan_result.json")
	if err != nil {
		fmt.Println("Dosya oluşturulamadı:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	err = encoder.Encode(scanResult)
	if err != nil {
		fmt.Println("JSON kodlama hatası:", err)
	}
}

// Function to perform a full port scan
func scanAllPorts(scanner *PortScanner, scanVersions bool) {
	var scanTechnology string
	fmt.Print("Teknoloji taraması yapmak ister misiniz? (E/H): ")
	fmt.Scanln(&scanTechnology)
	scanVersions = strings.ToLower(scanTechnology) == "e"

	fmt.Println(strings.Repeat("-", 45))
	fmt.Println("Hedef IP adresi taraması başlıyor...")
	fmt.Println("Tarama başlangıç tarihi:", time.Now())

	portsToScan := make([]int, 65535)
	for i := range portsToScan {
		portsToScan[i] = i + 1
	}
	openPorts := scanner.ScanAllPorts(portsToScan, scanVersions)

	printScanResults(openPorts, scanner, scanVersions)
}

// Function to perform a quick scan of commonly used ports
func scanCommonPorts(scanner *PortScanner, scanVersions bool) {
	fmt.Println(strings.Repeat("-", 45))
	fmt.Println("Hedef IP adresi hızlı taraması başlıyor...")
	fmt.Println("Tarama başlangıç tarihi:", time.Now())

	openPorts := scanner.ScanAllPorts(CommonPorts(), scanVersions)

	printScanResults(openPorts, scanner, scanVersions)
}

// Function to scan a single port
func scanSinglePort(scanner *PortScanner) {
	var portToScan int
	fmt.Print("Taramak istediğiniz port numarasını girin: ")
	fmt.Scanln(&portToScan)

	var scanTechnology string
	fmt.Print("Teknoloji taraması yapmak ister misiniz? (E/H): ")
	fmt.Scanln(&scanTechnology)
	scanTechnology = strings.ToLower(scanTechnology)

	fmt.Println(strings.Repeat("-", 45))
	fmt.Println("Hedef IP adresi taraması başlıyor...")
	fmt.Println("Tarama başlangıç tarihi:", time.Now())

	scanResult := scanner.ScanPort(portToScan, scanTechnology == "e")
	if scanResult == 0 {
		service := scanner.openPorts[portToScan]
		fmt.Println(strings.Repeat("-", 45))
		fmt.Printf("Port %d açık. Servis: %s\n", portToScan, service)
		fmt.Println(strings.Repeat("-", 45))
	} else {
		fmt.Println(strings.Repeat("-", 45))
		fmt.Printf("Port %d kapalı.\n", portToScan)
		fmt.Println(strings.Repeat("-", 45))
	}
}

// Function to print scan results
func printScanResults(openPorts []int, scanner *PortScanner, scanVersions bool) {
	if len(openPorts) > 0 {
		fmt.Println(strings.Repeat("-", 45))
		fmt.Println("Açık portlar:")

		result := ScanResult{
			TargetIP:    scanner.target,
			ScanDate:    time.Now(),
			OpenPorts:   scanner.openPorts,
			ScanVersions: scanVersions,
		}

		writeScanResultToFile(result)

		for _, port := range openPorts {
			service := scanner.openPorts[port]
			fmt.Printf("Port %d açık. Servis: %s\n", port, service)
		}
		fmt.Println(strings.Repeat("-", 45))
	} else {
		fmt.Println("Açık port bulunamadı.")
	}
}

func main() {
	fmt.Println("Port Tarayıcıya Hoş Geldiniz!")

	var targetIP string
	fmt.Print("Hedef IP adresini girin: ")
	fmt.Scanln(&targetIP)

	fmt.Println(strings.Repeat("-", 45))
	fmt.Println("Port tarama seçenekleri:")
	fmt.Println("1. Tüm portları tarat")
	fmt.Println("2. Hızlı tarama")
	fmt.Println("3. Tek bir port tara")
	fmt.Println("4. Çıkış")
	fmt.Println(strings.Repeat("-", 45))

	var option string
	fmt.Print("Seçeneğinizi girin (1/2/3/4): ")
	fmt.Scanln(&option)

	if option == "4" {
		return
	}

	scanner := NewPortScanner(targetIP)

	switch option {
	case "1":
		scanAllPorts(scanner, true)
	case "2":
		scanCommonPorts(scanner, true)
	case "3":
		scanSinglePort(scanner)
	default:
		fmt.Println("Geçersiz seçenek. Lütfen 1, 2, 3 veya 4 seçeneğini girin.")
	}
}
