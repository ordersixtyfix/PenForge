package org.penforge.backend.targetFinder;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TargetFinderService {

    public List<String> scanNetworkDevices(String networkRange) {
        List<String> devices = new ArrayList<>();
        String command = "wsl nmap -sn " + networkRange;

        ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
        processBuilder.redirectErrorStream(true);

        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            Pattern ipPattern = Pattern.compile("^Nmap scan report for (.+)$");

            while ((line = reader.readLine()) != null) {
                Matcher ipMatcher = ipPattern.matcher(line);
                if (ipMatcher.find()) {
                    devices.add(ipMatcher.group(1));
                }
            }
            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return devices;
    }
}
