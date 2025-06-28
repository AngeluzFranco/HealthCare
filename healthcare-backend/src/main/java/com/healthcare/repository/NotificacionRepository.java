package com.healthcare.repository;

import com.healthcare.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
    List<Notificacion> findByUsuarioIdAndLeidaEnIsNullOrderByFechaCreacionDesc(Long usuarioId);
    List<Notificacion> findByUsuarioIdAndEnviadaEnAfter(Long usuarioId, LocalDateTime fechaActual);
}