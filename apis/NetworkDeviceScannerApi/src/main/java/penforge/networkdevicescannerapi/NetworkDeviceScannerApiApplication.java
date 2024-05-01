// GET /devices/find

package penforge.networkdevicescannerapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * An API for scanning network devices.
 * This API provides endpoints to discover devices on the network and retrieve information about them.
 */
@SpringBootApplication
@EnableAsync
public class NetworkDeviceScannerApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(NetworkDeviceScannerApiApplication.class, args);
    }

    @RestController
    @RequestMapping("/devices")
    public static class DeviceController {

        private final DeviceService deviceService;

        public DeviceController(DeviceService deviceService) {
            this.deviceService = deviceService;
        }

        @GetMapping("/find")
        public CompletableFuture<String> findDevices() {
            return deviceService.findDevices();
        }
    }

    @Service
    public static class DeviceService {

        public CompletableFuture<String> findDevices() {
            return CompletableFuture.supplyAsync(() -> {
                StringBuilder jsonBuilder = new StringBuilder();

                if (!isToolInstalled("nmap")) {
                    return "Nmap is not installed.";
                }

                List<String> devices = scanDevices();

                jsonBuilder.append("{");
                jsonBuilder.append("\"devices\": [");
                for (String device : devices) {
                    jsonBuilder.append(device);
                    jsonBuilder.append(",");
                }
                if (!devices.isEmpty()) {
                    jsonBuilder.deleteCharAt(jsonBuilder.length() - 1);
                }
                jsonBuilder.append("]");
                jsonBuilder.append("}");

                return jsonBuilder.toString();
            });
        }

        private boolean isToolInstalled(String toolName) {
            try {
                Process process = new ProcessBuilder(toolName, "--version").start();
                boolean installed = process.waitFor() == 0;
                System.out.println(toolName + " installed: " + installed);
                return installed;
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
                return false;
            }
        }

        private List<String> scanDevices() {
            List<String> devices = new ArrayList<>();
            try {
                // Scan devices using Nmap and retrieve detailed information
                // Ping Scan ({"devices": [{"ip": "192.168.1.1", "status": "up"}]})
                Process nmapProcess = new ProcessBuilder("nmap", "-sn", "192.168.1.1-254").start();
                BufferedReader nmapReader = new BufferedReader(new InputStreamReader(nmapProcess.getInputStream()));
                String line;
                StringBuilder outputBuilder = new StringBuilder();
                boolean startParsing = false; // Flag to indicate start of parsing
                while ((line = nmapReader.readLine()) != null) {
                    if (line.contains("Nmap scan report for")) {
                        if (startParsing) {
                            devices.add(outputBuilder.toString());
                            outputBuilder.setLength(0); // Clear StringBuilder for new output
                        }
                        outputBuilder.append("{");
                        outputBuilder.append("\"ip\": \"").append(line.split(" ")[4]).append("\", ");
                        startParsing = true;
                    } else if (startParsing && line.contains("Host is up")) {
                        // If host is up, no need to parse further
                        outputBuilder.append("\"status\": \"up\"");
                        break;
                    }
                }
                nmapProcess.waitFor();

                if (startParsing) {
                    // Append closing bracket if parsing was started
                    outputBuilder.append("}");
                    devices.add(outputBuilder.toString());
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
            return devices;
        }
    }
}