package org.penforge.backend.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PortStatus {

    private int closed;
    private int filtered;
    private int open;




}
