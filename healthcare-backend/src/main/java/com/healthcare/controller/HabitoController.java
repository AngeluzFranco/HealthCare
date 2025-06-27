package com.healthcare.controller;

import com.healthcare.model.Habito;
import com.healthcare.service.HabitoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habitos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")

public class HabitoController {
    
    private final HabitoService habitoService;
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Habito>> obtenerHabitosPorUsuario(@PathVariable Long usuarioId) {
        log.info("GET /habitos/usuario/{} - Obteniendo hábitos por usuario", usuarioId);
        List<Habito> habitos = habitoService.obtenerHabitosPorUsuario(usuarioId);
        return ResponseEntity.ok(habitos);
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Habito>> obtenerHabitosPorCategoria(@PathVariable String categoria) {
        log.info("GET /habitos/categoria/{} - Obteniendo hábitos por categoría", categoria);
        List<Habito> habitos = habitoService.obtenerHabitosPorCategoria(categoria);
        return ResponseEntity.ok(habitos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Habito> obtenerHabitoPorId(@PathVariable Long id) {
        log.info("GET /habitos/{} - Obteniendo hábito por ID", id);
        return habitoService.obtenerHabitoPorId(id)
                .map(habito -> ResponseEntity.ok(habito))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Habito> crearHabito(@RequestBody Habito habito) {
        log.info("POST /habitos - Creando nuevo hábito");
        try {
            Habito nuevoHabito = habitoService.crearHabito(habito);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHabito);
        } catch (RuntimeException e) {
            log.error("Error al crear hábito: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Habito> actualizarHabito(@PathVariable Long id, @RequestBody Habito habito) {
        log.info("PUT /habitos/{} - Actualizando hábito", id);
        try {
            Habito habitoActualizado = habitoService.actualizarHabito(id, habito);
            return ResponseEntity.ok(habitoActualizado);
        } catch (RuntimeException e) {
            log.error("Error al actualizar hábito: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarHabito(@PathVariable Long id) {
        log.info("DELETE /habitos/{} - Eliminando hábito", id);
        try {
            habitoService.eliminarHabito(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error al eliminar hábito: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/")
    public ResponseEntity<List<Habito>> obtenerTodosLosHabitos() {
        log.info("GET /habitos - Obteniendo todos los hábitos");
        List<Habito> habitos = habitoService.obtenerTodosLosHabitos();
        return ResponseEntity.ok(habitos);
    }

}
