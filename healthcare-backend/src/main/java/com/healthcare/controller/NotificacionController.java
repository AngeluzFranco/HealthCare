package com.healthcare.controller;

import com.healthcare.model.Notificacion;
import com.healthcare.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    @PostMapping("/")
    public ResponseEntity<Notificacion> crearNotificacion(@RequestBody Notificacion notificacion) {
        Notificacion creada = notificacionService.crearNotificacion(notificacion);
        return ResponseEntity.ok(creada);
    }

    @GetMapping("/")
    public ResponseEntity<List<Notificacion>> obtenerTodas() {
        return ResponseEntity.ok(notificacionService.obtenerTodas());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public ResponseEntity<List<Notificacion>> obtenerNoLeidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesNoLeidas(usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notificacion> actualizarNotificacion(@PathVariable Long id, @RequestBody Notificacion notificacion) {
        return ResponseEntity.ok(notificacionService.actualizarNotificacion(id, notificacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNotificacion(@PathVariable Long id) {
        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/activas/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesActivasPorUsuario(@PathVariable Long usuarioId) {
        List<Notificacion> activas = notificacionService.obtenerNotificacionesActivasPorUsuario(usuarioId);
        return ResponseEntity.ok(activas);
    }
}