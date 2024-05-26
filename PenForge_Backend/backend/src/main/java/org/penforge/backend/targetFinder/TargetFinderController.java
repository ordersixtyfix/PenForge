package org.penforge.backend.targetFinder;

import lombok.AllArgsConstructor;
import org.penforge.backend.common.GenericResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path="api/v1/find-target")
public class TargetFinderController {
    private final TargetFinderService targetFinderService;

    @GetMapping()
    public ResponseEntity<GenericResponse<List<String>>> findTarget(){
        try {
            List<String> devices = targetFinderService.scanNetworkDevices("192.168.0.0/16");
            return ResponseEntity.ok(new GenericResponse<List<String>>().setCode(200).setData(devices));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new GenericResponse<List<String>>().setCode(400).setData(null));
        }
    }
}
