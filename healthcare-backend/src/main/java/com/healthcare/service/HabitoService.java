package com.healthcare.service;

import com.healthcare.model.Habito;
import com.healthcare.model.Usuario;
import com.healthcare.repository.HabitoRepository;
import com.healthcare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HabitoService {

    private final HabitoRepository habitoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Habito> obtenerHabitosPorUsuario(Long usuarioId) {
        log.info("Obteniendo hábitos para usuario ID: {}", usuarioId);

        // Verify user exists first
        if (!usuarioRepository.existsById(usuarioId)) {
            log.warn("Usuario no encontrado con ID: {}", usuarioId);
            return new ArrayList<>();
        }

        List<Habito> habitos = habitoRepository.findByUsuarioIdAndActivoTrue(usuarioId);
        log.info("Encontrados {} hábitos activos para usuario {}", habitos.size(), usuarioId);
        return habitos;
    }

    public List<Habito> obtenerHabitosPorCategoria(String categoria) {
        log.info("Obteniendo hábitos por categoría: {}", categoria);
        return habitoRepository.findByCategoria(categoria);
    }

    public Optional<Habito> obtenerHabitoPorId(Long id) {
        log.info("Obteniendo hábito por ID: {}", id);
        return habitoRepository.findById(id);
    }

    public Habito crearHabito(Habito habito) {
        log.info("Creando nuevo hábito: {}", habito.getNombre());

        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(habito.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + habito.getUsuario().getId()));

        habito.setUsuario(usuario);
        return habitoRepository.save(habito);
    }

    public Habito actualizarHabito(Long id, Habito habitoActualizado) {
        log.info("Actualizando hábito con ID: {}", id);

        Habito habito = habitoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hábito no encontrado con ID: " + id));

        habito.setNombre(habitoActualizado.getNombre());
        habito.setDescripcion(habitoActualizado.getDescripcion());
        habito.setCategoria(habitoActualizado.getCategoria());
        habito.setMetaDiaria(habitoActualizado.getMetaDiaria());
        habito.setUnidadMedida(habitoActualizado.getUnidadMedida());
        habito.setActivo(habitoActualizado.getActivo());

        return habitoRepository.save(habito);
    }

    public void eliminarHabito(Long id) {
        log.info("Eliminando hábito con ID: {}", id);

        Habito habito = habitoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hábito no encontrado con ID: " + id));

        habito.setActivo(false);
        habitoRepository.save(habito);
    }

    public List<Habito> obtenerTodosLosHabitos() {
        log.info("Obteniendo todos los hábitos");
        return habitoRepository.findAll();
    }

}
