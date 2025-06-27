package com.healthcare.controller;

import com.healthcare.model.RegistroHabito;
import com.healthcare.service.RegistroHabitoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/registros")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RegistroHabitoController {
    
    private final RegistroHabitoService registroHabitoService;
    
    @GetMapping("/habito/{habitoId}")
    public ResponseEntity<List<RegistroHabito>> obtenerRegistrosPorHabito(@PathVariable Long habitoId) {
        log.info("GET /registros/habito/{} - Obteniendo registros por hábito", habitoId);
        List<RegistroHabito> registros = registroHabitoService.obtenerRegistrosPorHabito(habitoId);
        return ResponseEntity.ok(registros);
    }
    
    @GetMapping("/usuario/{usuarioId}/fecha/{fecha}")
    public ResponseEntity<List<RegistroHabito>> obtenerRegistrosPorUsuarioYFecha(
            @PathVariable Long usuarioId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        log.info("GET /registros/usuario/{}/fecha/{} - Obteniendo registros por usuario y fecha", usuarioId, fecha);
        List<RegistroHabito> registros = registroHabitoService.obtenerRegistrosPorUsuarioYFecha(usuarioId, fecha);
        return ResponseEntity.ok(registros);
    }
    
    @GetMapping("/usuario/{usuarioId}/rango")
    public ResponseEntity<List<RegistroHabito>> obtenerRegistrosPorUsuarioYRangoFechas(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        log.info("GET /registros/usuario/{}/rango - Obteniendo registros por usuario entre {} y {}", usuarioId, fechaInicio, fechaFin);
        List<RegistroHabito> registros = registroHabitoService.obtenerRegistrosPorUsuarioYRangoFechas(usuarioId, fechaInicio, fechaFin);
        return ResponseEntity.ok(registros);
    }
    
    @PostMapping
    public ResponseEntity<RegistroHabito> crearRegistro(@RequestBody RegistroHabito registro) {
        log.info("POST /registros - Creando nuevo registro");
        try {
            RegistroHabito nuevoRegistro = registroHabitoService.crearRegistro(registro);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRegistro);
        } catch (RuntimeException e) {
            log.error("Error al crear registro: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RegistroHabito> actualizarRegistro(@PathVariable Long id, @RequestBody RegistroHabito registro) {
        log.info("PUT /registros/{} - Actualizando registro", id);
        try {
            RegistroHabito registroActualizado = registroHabitoService.actualizarRegistro(id, registro);
            return ResponseEntity.ok(registroActualizado);
        } catch (RuntimeException e) {
            log.error("Error al actualizar registro: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable Long id) {
        log.info("DELETE /registros/{} - Eliminando registro", id);
        try {
            registroHabitoService.eliminarRegistro(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error al eliminar registro: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
