package com.healthcare.controller;

import com.healthcare.dto.DatoCategoria;
import com.healthcare.dto.DatoProgreso;
import com.healthcare.model.Estadisticas;
import com.healthcare.service.EstadisticasService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estadisticas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Estadisticas> obtenerEstadisticasUsuario(@PathVariable Long usuarioId) {
        log.info("GET /estadisticas/usuario/{} - Obteniendo estadísticas", usuarioId);
        try {
            Estadisticas estadisticas = estadisticasService.obtenerEstadisticasUsuario(usuarioId);
            return ResponseEntity.ok(estadisticas);
        } catch (RuntimeException e) {
            log.error("Error al obtener estadísticas: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{usuarioId}/progreso-semanal")
    public ResponseEntity<List<DatoProgreso>> obtenerProgresoSemanal(@PathVariable Long usuarioId) {
        log.info("GET /estadisticas/usuario/{}/progreso-semanal", usuarioId);
        List<DatoProgreso> progreso = estadisticasService.obtenerProgresoSemanal(usuarioId);
        return ResponseEntity.ok(progreso);
    }

    @GetMapping("/usuario/{usuarioId}/progreso-mensual")
    public ResponseEntity<List<DatoProgreso>> obtenerProgresoMensual(@PathVariable Long usuarioId) {
        log.info("GET /estadisticas/usuario/{}/progreso-mensual", usuarioId);
        List<DatoProgreso> progreso = estadisticasService.obtenerProgresoMensual(usuarioId);
        return ResponseEntity.ok(progreso);
    }

    @GetMapping("/usuario/{usuarioId}/por-categorias")
    public ResponseEntity<List<DatoCategoria>> obtenerPorCategorias(@PathVariable Long usuarioId) {
        log.info("GET /estadisticas/usuario/{}/por-categorias", usuarioId);
        List<DatoCategoria> categorias = estadisticasService.obtenerPorCategorias(usuarioId);
        return ResponseEntity.ok(categorias);
    }
}
