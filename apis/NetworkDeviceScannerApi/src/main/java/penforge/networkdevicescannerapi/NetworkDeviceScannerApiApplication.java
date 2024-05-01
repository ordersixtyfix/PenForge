// GET /devices/find

package penforge.networkdevicescannerapi;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
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

        /**
         * Asynchronously finds network devices.
         * @return CompletableFuture containing JSON string with devices information.
         */
        public CompletableFuture<String> findDevices() {
            return CompletableFuture.supplyAsync(() -> {
                JsonObject jsonBuilder = new JsonObject();

                if (!isToolInstalled("nmap")) {
                    return "Nmap is not installed.";
                }

                List<JsonObject> devices = scanDevices();

                JsonArray devicesArray = new JsonArray();
                for (JsonObject device : devices) {
                    devicesArray.add(device);
                }

                jsonBuilder.add("devices", devicesArray);

                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                return gson.toJson(jsonBuilder);
            });
        }

        /**
         * Checks if a tool is installed.
         * @param toolName The name of the tool to check.
         * @return True if the tool is installed, false otherwise.
         */
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

        /**
         * Scans network devices using Nmap.
         * @return List of JSON objects containing device information.
         */
        private List<JsonObject> scanDevices() {
            List<JsonObject> devices = new ArrayList<>();
            try {
                Process nmapProcess = new ProcessBuilder("nmap", "-sn", "192.168.1.1-254").start();
                try (BufferedReader nmapReader = new BufferedReader(new InputStreamReader(nmapProcess.getInputStream()))) {
                    String line;
                    while ((line = nmapReader.readLine()) != null) {
                        if (line.contains("Nmap scan report for")) {
                            JsonObject deviceObject = new JsonObject();
                            deviceObject.addProperty("ip", line.split(" ")[4]);
                            deviceObject.addProperty("status", "up");
                            devices.add(deviceObject);
                        }
                    }
                }
                nmapProcess.waitFor();
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
            return devices;
        }
    }
}

