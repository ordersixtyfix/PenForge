package org.penforge.backend.statistics;

import lombok.Data;
import lombok.AllArgsConstructor;
import org.penforge.backend.pentestReport.PentestReportRepository;
import org.springframework.stereotype.Service;
import org.penforge.backend.pentestReport.PentestReport;

import java.util.List;

@Service // Bu sınıfı Spring bean'i olarak tanımlar
@Data
@AllArgsConstructor
public class Statistics {

    private final PentestReportRepository pentestReportRepository;

    public StatisticsData calculateStatistics() {
        List<PentestReport> reports = pentestReportRepository.findAll();

        int totalTargets = reports.size();
        int vulnerableTargets = (int) reports.stream().filter(report -> !report.getCredentials().isEmpty()).count();
        int totalOpenPorts = reports.stream().mapToInt(report -> report.getPortData().size()).sum();
        int totalTests = totalTargets; // Each report represents one test

        return new StatisticsData(totalTargets, vulnerableTargets, totalOpenPorts, totalTests);
    }

    @Data
    @AllArgsConstructor
    public static class StatisticsData {
        private int totalTargets;
        private int vulnerableTargets;
        private int totalOpenPorts;
        private int totalTests;
    }
}
