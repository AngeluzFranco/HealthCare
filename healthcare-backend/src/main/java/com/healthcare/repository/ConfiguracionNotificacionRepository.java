package com.healthcare.repository;

import com.healthcare.model.ConfiguracionNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracionNotificacionRepository extends JpaRepository<ConfiguracionNotificacion, Long> {

    Optional<ConfiguracionNotificacion> findByUsuarioId(Long usuarioId);
}
