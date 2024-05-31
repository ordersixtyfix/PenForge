package org.penforge.backend.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatisticsData{

    private int totalTargets;
    private int vulnerableTargets;
    private int totalOpenPorts;
    private int totalTests;
}