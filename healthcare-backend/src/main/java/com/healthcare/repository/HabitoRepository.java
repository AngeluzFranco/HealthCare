package com.healthcare.repository;

import com.healthcare.model.Habito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitoRepository extends JpaRepository<Habito, Long> {
    
    List<Habito> findByUsuarioIdAndActivoTrue(Long usuarioId);
    
    List<Habito> findByUsuarioId(Long usuarioId);
    
    List<Habito> findByCategoria(String categoria);
    
    @Query("SELECT h FROM Habito h WHERE h.usuario.id = :usuarioId AND h.categoria = :categoria AND h.activo = true")
    List<Habito> findByUsuarioIdAndCategoriaAndActivoTrue(@Param("usuarioId") Long usuarioId, @Param("categoria") String categoria);
}
