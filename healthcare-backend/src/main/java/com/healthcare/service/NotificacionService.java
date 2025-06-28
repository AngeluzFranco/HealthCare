package com.healthcare.service;

import com.healthcare.model.Notificacion;
import com.healthcare.model.Usuario;
import com.healthcare.model.Habito;
import com.healthcare.repository.NotificacionRepository;
import com.healthcare.repository.UsuarioRepository;
import com.healthcare.repository.HabitoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final HabitoRepository habitoRepository;

    public Notificacion crearNotificacion(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    public List<Notificacion> obtenerTodas() {
        return notificacionRepository.findAll();
    }

    public List<Notificacion> obtenerNotificacionesUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    public List<Notificacion> obtenerNotificacionesNoLeidas(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidaEnIsNullOrderByFechaCreacionDesc(usuarioId);
    }

    public Notificacion actualizarNotificacion(Long id, Notificacion notificacion) {
        Notificacion existente = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));

        existente.setTitulo(notificacion.getTitulo());
        existente.setMensaje(notificacion.getMensaje());
        existente.setEstado(notificacion.getEstado());
        existente.setPrioridad(notificacion.getPrioridad());
        existente.setEnviadaEn(notificacion.getEnviadaEn());
        existente.setLeidaEn(notificacion.getLeidaEn());
        // Si quieres actualizar habito o usuario, agrégalo aquí

        return notificacionRepository.save(existente);
    }

    public void eliminarNotificacion(Long id) {
        if (!notificacionRepository.existsById(id)) {
            throw new RuntimeException("Notificación no encontrada");
        }
        notificacionRepository.deleteById(id);
    }

    public List<Notificacion> obtenerNotificacionesActivasPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndEnviadaEnAfter(usuarioId, LocalDateTime.now());
    }
}