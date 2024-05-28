package main

import (
	"fmt"
	"net"
)

// EnumerateSambaShares fonksiyonu, verilen hedef IP adresindeki Samba paylaşımlarını listeler
func EnumerateSambaShares(ip string) {
	target := net.ParseIP(ip)
	if target == nil {
		fmt.Printf("Geçersiz IP adresi: %s\n", ip)
		return
	}

	// Samba için varsayılan SMB portu 445'tir
	port := 445
	targetAddr := fmt.Sprintf("%s:%d", ip, port)

	// SMB sunucusuna bağlan
	conn, err := net.Dial("tcp", targetAddr)
	if err != nil {
		fmt.Printf("Bağlantı hatası: %v\n", err)
		return
	}
	defer conn.Close()

	fmt.Printf("Samba sunucusuna bağlandı: %s\n", ip)

	// Örnek olarak, sunucudan bir istek gönderip yanıt alalım (gerçek SMB protokolü değil)
	fmt.Fprintf(conn, "Tree Connect isteği gönderildi\n")

	// Sunucudan gelen yanıtları oku ve işle
	buffer := make([]byte, 1024)
	n, err := conn.Read(buffer)
	if err != nil {
		fmt.Printf("Okuma hatası: %v\n", err)
		return
	}

	response := string(buffer[:n])
	fmt.Printf("Sunucudan gelen yanıt: %s\n", response)

	// İlgili yanıtı analiz ederek paylaşımları ve kullanıcıları listele
	// Gerçek bir uygulamada SMB protokolüne özgü yanıtları işlemek gerekecektir
}

func main() {
	// Kullanıcıdan hedef IP adresini al
	var ipAddress string
	fmt.Print("Hedef IP adresini girin: ")
	fmt.Scanln(&ipAddress)

	// EnumerateSambaShares fonksiyonunu kullanarak Samba paylaşımlarını listele
	EnumerateSambaShares(ipAddress)
}
