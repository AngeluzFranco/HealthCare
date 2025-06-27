package com.healthcare.service;

import com.healthcare.model.Habito;
import com.healthcare.model.RegistroHabito;
import com.healthcare.repository.HabitoRepository;
import com.healthcare.repository.RegistroHabitoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import com.healthcare.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RegistroHabitoService {

    private final RegistroHabitoRepository registroHabitoRepository;
    private final HabitoRepository habitoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<RegistroHabito> obtenerRegistrosPorHabito(Long habitoId) {
        log.info("Obteniendo registros para hábito ID: {}", habitoId);
        return registroHabitoRepository.findByHabitoId(habitoId);
    }

    public List<RegistroHabito> obtenerRegistrosPorUsuarioYFecha(Long usuarioId, LocalDate fecha) {
        log.info("Obteniendo registros para usuario ID: {} en fecha: {}", usuarioId, fecha);

        // Verify user exists
        if (!usuarioRepository.existsById(usuarioId)) {
            log.warn("Usuario no encontrado con ID: {}", usuarioId);
            return new ArrayList<>();
        }

        List<RegistroHabito> registros = registroHabitoRepository.findByUsuarioIdAndFecha(usuarioId, fecha);
        log.info("Encontrados {} registros para usuario {} en fecha {}", registros.size(), usuarioId, fecha);
        return registros;
    }

    public List<RegistroHabito> obtenerRegistrosPorUsuarioYRangoFechas(Long usuarioId, LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Obteniendo registros para usuario ID: {} entre {} y {}", usuarioId, fechaInicio, fechaFin);
        return registroHabitoRepository.findByUsuarioIdAndFechaBetween(usuarioId, fechaInicio, fechaFin);
    }

    public RegistroHabito crearRegistro(RegistroHabito registro) {
        log.info("Creando nuevo registro para hábito ID: {}", registro.getHabito().getId());

        // Verificar que el hábito existe
        Habito habito = habitoRepository.findById(registro.getHabito().getId())
                .orElseThrow(() -> new RuntimeException("Hábito no encontrado con ID: " + registro.getHabito().getId()));

        registro.setHabito(habito);
        return registroHabitoRepository.save(registro);
    }

    public RegistroHabito actualizarRegistro(Long id, RegistroHabito registroActualizado) {
        log.info("Actualizando registro con ID: {}", id);

        RegistroHabito registro = registroHabitoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado con ID: " + id));

        registro.setFecha(registroActualizado.getFecha());
        registro.setValor(registroActualizado.getValor());
        registro.setNotas(registroActualizado.getNotas());
        registro.setCompletado(registroActualizado.getCompletado());

        return registroHabitoRepository.save(registro);
    }

    public void eliminarRegistro(Long id) {
        log.info("Eliminando registro con ID: {}", id);

        if (!registroHabitoRepository.existsById(id)) {
            throw new RuntimeException("Registro no encontrado con ID: " + id);
        }

        registroHabitoRepository.deleteById(id);
    }
}
