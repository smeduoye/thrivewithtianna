package com.thrivewithtianna.metrics;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.thrivewithtianna.auth.AuthenticatedUser;
import com.thrivewithtianna.auth.CurrentUser;
import com.thrivewithtianna.metrics.MetricsDtos.SleepLogRequest;
import com.thrivewithtianna.metrics.MetricsDtos.SleepLogResponse;
import com.thrivewithtianna.metrics.MetricsDtos.SymptomLogRequest;
import com.thrivewithtianna.metrics.MetricsDtos.SymptomLogResponse;
import com.thrivewithtianna.metrics.MetricsDtos.WeightLogRequest;
import com.thrivewithtianna.metrics.MetricsDtos.WeightLogResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class MetricsController {

    private final MetricsService metricsService;

    public MetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @PostMapping("/weight")
    @ResponseStatus(HttpStatus.CREATED)
    public WeightLogResponse logWeight(
            @CurrentUser AuthenticatedUser user,
            @Valid @RequestBody WeightLogRequest request) {
        return metricsService.logWeight(user.id(), request);
    }

    @GetMapping("/weight")
    public List<WeightLogResponse> listWeight(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return metricsService.listWeight(user.id(), from, to);
    }

    @PostMapping("/sleep")
    @ResponseStatus(HttpStatus.CREATED)
    public SleepLogResponse logSleep(
            @CurrentUser AuthenticatedUser user,
            @Valid @RequestBody SleepLogRequest request) {
        return metricsService.logSleep(user.id(), request);
    }

    @GetMapping("/sleep")
    public List<SleepLogResponse> listSleep(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return metricsService.listSleep(user.id(), from, to);
    }

    @PostMapping("/symptoms")
    @ResponseStatus(HttpStatus.CREATED)
    public SymptomLogResponse logSymptom(
            @CurrentUser AuthenticatedUser user,
            @Valid @RequestBody SymptomLogRequest request) {
        return metricsService.logSymptom(user.id(), request);
    }

    @GetMapping("/symptoms")
    public List<SymptomLogResponse> listSymptoms(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return metricsService.listSymptoms(user.id(), from, to);
    }
}
