package main

import (
    "encoding/json"
    "encoding/xml"
    "fmt"
    "os"
    "os/exec"
    "text/tabwriter"
)

type NmapRun struct {
    Hosts []Host `xml:"host"`
}

type Host struct {
    Addresses []Address `xml:"address"`
    Ports     []Port    `xml:"ports>port"`
}

type Address struct {
    Addr string `xml:"addr,attr"`
}

type Port struct {
    PortId  uint16  `xml:"portid,attr"`
    State   State   `xml:"state"`
    Service Service `xml:"service"`
}

type State struct {
    State string `xml:"state,attr"`
}

type Service struct {
    Name string `xml:"name,attr"`
}

type ScanResult struct {
    IPAddress string `json:"ip_address"`
    Port      uint16 `json:"port"`
    State     string `json:"state"`
    Service   string `json:"service"`
}

func main() {
    subnet := "192.168.220.0/24" // Tarama yapmak istediğiniz alt ağ

    // Nmap komutunu çalıştır
    cmd := exec.Command("nmap", "-oX", "-", subnet)
    output, err := cmd.Output()
    if err != nil {
        fmt.Println("Nmap komutu çalıştırılamadı:", err)
        return
    }

    // Nmap XML çıktısını ayrıştır
    var result NmapRun
    err = xml.Unmarshal(output, &result)
    if err != nil {
        fmt.Println("Nmap çıktısı ayrıştırılamadı:", err)
        return
    }

    // JSON çıktısı için bir dilim oluştur
    var scanResults []ScanResult

    // Tabwriter ile düzenli çıktı yazdırma
    w := tabwriter.NewWriter(os.Stdout, 0, 0, 1, ' ', tabwriter.Debug)
    fmt.Fprintln(w, "IP Adresi\tPort\tDurum\tServis")

    // Tarama sonuçlarını yazdır ve JSON formatına ekle
    for _, host := range result.Hosts {
        for _, addr := range host.Addresses {
            for _, port := range host.Ports {
                fmt.Fprintf(w, "%s\t%d\t%s\t%s\n", addr.Addr, port.PortId, port.State.State, port.Service.Name)
                scanResults = append(scanResults, ScanResult{
                    IPAddress: addr.Addr,
                    Port:      port.PortId,
                    State:     port.State.State,
                    Service:   port.Service.Name,
                })
            }
        }
    }

    // Yazıcıyı flush et
    w.Flush()

    // JSON çıktısını dosyaya yazma
    jsonData, err := json.MarshalIndent(scanResults, "", "  ")
    if err != nil {
        fmt.Println("JSON verisi oluşturulamadı:", err)
        return
    }

    err = os.WriteFile("scan_results.json", jsonData, 0644)
    if err != nil {
        fmt.Println("JSON dosyası yazılamadı:", err)
        return
    }

    fmt.Println("Tarama sonuçları scan_results.json dosyasına yazıldı.")
}
