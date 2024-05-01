// GET /execute?tool=tool1&parameter=myParameter

package penforge.commandcontrollerapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * CommandControllerApiApplication is a Java API that provides an HTTP endpoint for executing shell commands asynchronously.
 * It allows clients to execute predefined commands securely within a controlled environment.
 */
@SpringBootApplication
@EnableAsync
public class CommandControllerApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommandControllerApiApplication.class, args);
    }
}

@RestController
class CommandController {

    private static final Map<String, String> allowedCommands = Map.of(
            "tool1", "path/to/tool1",
            "tool2", "path/to/tool2"
    );

    /**
     * Executes the specified command asynchronously and returns the result.
     * @param tool The command/tool to execute.
     * @param parameter The parameter for the command (if any).
     * @return A CompletableFuture representing the result of the command execution.
     */
    @GetMapping(value = "/execute", produces = "text/plain")
    public CompletableFuture<String> executeCommand(@RequestParam String tool, @RequestParam String parameter) {
        return CompletableFuture.supplyAsync(() -> {
            if (!allowedCommands.containsKey(tool)) {
                return "Error: Tool not allowed";
            }

            String commandPath = allowedCommands.get(tool);
            String fullCommand = commandPath + " " + parameter;

            return executeProcess(fullCommand);
        });
    }

    private String executeProcess(String command) {
        StringBuilder output = new StringBuilder();

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(command.split("\\s+"));
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            boolean completed = process.waitFor(5, TimeUnit.SECONDS);
            if (!completed) {
                process.destroy();
                return "Command execution timed out";
            }

            int exitCode = process.exitValue();
            return exitCode == 0 ? output.toString() : "Command execution failed with exit code: " + exitCode;
        } catch (IOException e) {
            return "Error executing command: " + e.getMessage();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Command execution interrupted: " + e.getMessage();
        }
    }
}
