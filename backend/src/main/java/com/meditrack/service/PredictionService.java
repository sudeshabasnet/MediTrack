package com.meditrack.service;

import com.meditrack.dto.MedicineDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PredictionService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${ai.module.url:http://localhost:5000}")
    private String aiModuleUrl;

    public Map<String, Object> getExpiryAlerts(List<MedicineDto> medicines) {
        try {
            // Prepare medicines data for Python module
            List<Map<String, Object>> medicinesData = medicines.stream()
                    .map(medicine -> {
                        Map<String, Object> medMap = new HashMap<>();
                        medMap.put("id", medicine.getId());
                        medMap.put("name", medicine.getName());
                        medMap.put("expiryDate", medicine.getExpiryDate().format(DateTimeFormatter.ISO_DATE));
                        medMap.put("currentStock", medicine.getCurrentStock());
                        return medMap;
                    })
                    .toList();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("medicines", medicinesData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String url = aiModuleUrl + "/api/analytics/expiry-alerts";
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            
            log.warn("Failed to get expiry alerts from AI module");
            return Map.of("alerts", List.of());
        } catch (Exception e) {
            log.error("Error calling Python expiry prediction module", e);
            // Return empty alerts on error
            return Map.of("alerts", List.of());
        }
    }

    public Map<String, Object> getStockRecommendations(List<MedicineDto> medicines, List<Map<String, Object>> usageHistory) {
        try {
            List<Map<String, Object>> medicinesData = medicines.stream()
                    .map(medicine -> {
                        Map<String, Object> medMap = new HashMap<>();
                        medMap.put("id", medicine.getId());
                        medMap.put("name", medicine.getName());
                        medMap.put("currentStock", medicine.getCurrentStock());
                        medMap.put("minStockLevel", medicine.getMinStockLevel());
                        return medMap;
                    })
                    .toList();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("medicines", medicinesData);
            requestBody.put("usage_history", usageHistory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String url = aiModuleUrl + "/api/analytics/stock-recommendations";
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            
            log.warn("Failed to get stock recommendations from AI module");
            return Map.of("recommendations", List.of());
        } catch (Exception e) {
            log.error("Error calling Python stock recommendation module", e);
            return Map.of("recommendations", List.of());
        }
    }

    public boolean checkHealth() {
        try {
            String url = aiModuleUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("AI module health check failed", e);
            return false;
        }
    }
}
















