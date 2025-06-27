package com.healthcare.repository;

import com.healthcare.model.RegistroHabito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroHabitoRepository extends JpaRepository<RegistroHabito, Long> {

    List<RegistroHabito> findByHabitoId(Long habitoId);

    Optional<RegistroHabito> findByHabitoIdAndFecha(Long habitoId, LocalDate fecha);

    @Query("SELECT r FROM RegistroHabito r WHERE r.habito.usuario.id = :usuarioId AND r.fecha = :fecha")
    List<RegistroHabito> findByUsuarioIdAndFecha(@Param("usuarioId") Long usuarioId, @Param("fecha") LocalDate fecha);

    @Query("SELECT r FROM RegistroHabito r WHERE r.habito.usuario.id = :usuarioId AND r.fecha BETWEEN :fechaInicio AND :fechaFin")
    List<RegistroHabito> findByUsuarioIdAndFechaBetween(@Param("usuarioId") Long usuarioId, @Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
}
