package org.penforge.backend.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PortData {
    private String port;
    private String portState;
    private String portService;
}
