package org.penforge.backend.statistics;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@AllArgsConstructor
public class StatisticsController {

    private final Statistics statistics;

    @GetMapping("/api/v1/statistics")
    public Statistics.StatisticsData getStatistics() {
        return statistics.calculateStatistics();
    }
}
