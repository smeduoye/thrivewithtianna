package com.thrivewithtianna.metrics;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thrivewithtianna.metrics.MetricsDtos.SleepLogRequest;
import com.thrivewithtianna.metrics.MetricsDtos.SleepLogResponse;
import com.thrivewithtianna.metrics.MetricsDtos.SymptomLogRequest;
import com.thrivewithtianna.metrics.MetricsDtos.SymptomLogResponse;
import com.thrivewithtianna.metrics.MetricsDtos.WeightLogRequest;
import com.thrivewithtianna.metrics.MetricsDtos.WeightLogResponse;

@Service
public class MetricsService {

    private final WeightLogRepository weightRepository;
    private final SleepLogRepository sleepRepository;
    private final SymptomLogRepository symptomRepository;

    public MetricsService(
            WeightLogRepository weightRepository,
            SleepLogRepository sleepRepository,
            SymptomLogRepository symptomRepository) {
        this.weightRepository = weightRepository;
        this.sleepRepository = sleepRepository;
        this.symptomRepository = symptomRepository;
    }

    @Transactional
    public WeightLogResponse logWeight(UUID userId, WeightLogRequest request) {
        WeightLog log = WeightLog.create(userId, request.loggedAt(), request.weightKg());
        return WeightLogResponse.from(weightRepository.save(log));
    }

    @Transactional(readOnly = true)
    public List<WeightLogResponse> listWeight(UUID userId, LocalDate from, LocalDate to) {
        Instant start = from.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant end = to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        return weightRepository.findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(userId, start, end)
                .stream()
                .map(WeightLogResponse::from)
                .toList();
    }

    @Transactional
    public SleepLogResponse logSleep(UUID userId, SleepLogRequest request) {
        sleepRepository.findByUserIdAndLogDate(userId, request.logDate())
                .ifPresent(sleepRepository::delete);
        SleepLog log = SleepLog.create(userId, request.logDate(), request.hours(), request.quality());
        return SleepLogResponse.from(sleepRepository.save(log));
    }

    @Transactional(readOnly = true)
    public List<SleepLogResponse> listSleep(UUID userId, LocalDate from, LocalDate to) {
        return sleepRepository.findByUserIdAndLogDateBetweenOrderByLogDateDesc(userId, from, to)
                .stream()
                .map(SleepLogResponse::from)
                .toList();
    }

    @Transactional
    public SymptomLogResponse logSymptom(UUID userId, SymptomLogRequest request) {
        SymptomLog log = SymptomLog.create(
                userId, request.loggedAt(), request.symptom(), request.severity(), request.notes());
        return SymptomLogResponse.from(symptomRepository.save(log));
    }

    @Transactional(readOnly = true)
    public List<SymptomLogResponse> listSymptoms(UUID userId, LocalDate from, LocalDate to) {
        Instant start = from.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant end = to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        return symptomRepository.findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(userId, start, end)
                .stream()
                .map(SymptomLogResponse::from)
                .toList();
    }
}
