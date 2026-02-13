package com.electrical.calculation.controller;

import com.electrical.calculation.dto.CalculationResult;
import com.electrical.calculation.dto.InputData;
import com.electrical.calculation.service.CalculationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ApiController {

    private final CalculationService calculationService;

    public ApiController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @PostMapping("/api/calculate")
    public ResponseEntity<?> calculate(@RequestBody InputData inputData) {
        if (inputData.getP_nom_list() == null || inputData.getCos_phi_list() == null
            || inputData.getP_nom_list().size() != inputData.getCos_phi_list().size()) {
            return ResponseEntity.badRequest().body(
                Map.of("detail", "Количество номинальных мощностей должно совпадать с количеством cos φ"));
        }
        if (inputData.getCategory() < 1 || inputData.getCategory() > 3) {
            return ResponseEntity.badRequest().body(
                Map.of("detail", "Категория электроснабжения должна быть 1, 2 или 3"));
        }
        String lamp = inputData.getLampType();
        if (lamp == null || (!"LED".equalsIgnoreCase(lamp) && !"LL".equalsIgnoreCase(lamp))) {
            return ResponseEntity.badRequest().body(
                Map.of("detail", "Тип лампы должен быть 'LED' или 'LL'"));
        }
        try {
            CalculationResult result = calculationService.calculateAll(inputData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("detail", "Ошибка при расчёте: " + e.getMessage()));
        }
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
