package com.healthcare.service;

import com.healthcare.dto.DatoCategoria;
import com.healthcare.dto.DatoProgreso;
import com.healthcare.model.Estadisticas;
import com.healthcare.model.Habito;
import com.healthcare.model.RegistroHabito;
import com.healthcare.repository.HabitoRepository;
import com.healthcare.repository.RegistroHabitoRepository;
import com.healthcare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EstadisticasService {

    private final HabitoRepository habitoRepository;
    private final RegistroHabitoRepository registroHabitoRepository;
    private final UsuarioRepository usuarioRepository;

    public Estadisticas obtenerEstadisticasUsuario(Long usuarioId) {
        log.info("Calculando estadísticas para usuario: {}", usuarioId);


        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + usuarioId);
        }

        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);

        // Total de hábitos
        List<Habito> todosHabitos = habitoRepository.findByUsuarioId(usuarioId);
        long totalHabitos = todosHabitos.size();

        // Hábitos activos
        long habitosActivos = todosHabitos.stream()
                .filter(Habito::getActivo)
                .count();

        // Registros de hoy
        List<RegistroHabito> registrosHoy = registroHabitoRepository.findByUsuarioIdAndFecha(usuarioId, hoy);
        long habitosCompletadosHoy = registrosHoy.stream()
                .filter(RegistroHabito::getCompletado)
                .count();

        // Porcentaje completado hoy
        double porcentajeCompletadoHoy = habitosActivos > 0 ?
                (double) habitosCompletadosHoy / habitosActivos * 100 : 0;

        // Racha actual (días consecutivos con al menos un hábito completado)
        long rachaActual = calcularRachaActual(usuarioId);

        // Mejor categoría
        String mejorCategoria = obtenerMejorCategoria(usuarioId);

        // Días activos este mes
        long diasActivosEsteMes = calcularDiasActivosEsteMes(usuarioId, inicioMes, hoy);

        return new Estadisticas(
                totalHabitos,
                habitosActivos,
                habitosCompletadosHoy,
                porcentajeCompletadoHoy,
                rachaActual,
                mejorCategoria,
                diasActivosEsteMes
        );
    }

    public List<DatoProgreso> obtenerProgresoSemanal(Long usuarioId) {
        log.info("Obteniendo progreso semanal para usuario: {}", usuarioId);

        LocalDate hoy = LocalDate.now();
        LocalDate inicioSemana = hoy.minusDays(6); // Últimos 7 días

        List<DatoProgreso> progreso = new ArrayList<>();
        List<Habito> habitosActivos = habitoRepository.findByUsuarioIdAndActivoTrue(usuarioId);
        long totalHabitos = habitosActivos.size();

        for (int i = 0; i < 7; i++) {
            LocalDate fecha = inicioSemana.plusDays(i);
            List<RegistroHabito> registrosDia = registroHabitoRepository.findByUsuarioIdAndFecha(usuarioId, fecha);

            long completados = registrosDia.stream()
                    .filter(RegistroHabito::getCompletado)
                    .count();

            double porcentaje = totalHabitos > 0 ? (double) completados / totalHabitos * 100 : 0;

            progreso.add(new DatoProgreso(fecha, completados, totalHabitos, porcentaje));
        }

        return progreso;
    }

    public List<DatoProgreso> obtenerProgresoMensual(Long usuarioId) {
        log.info("Obteniendo progreso mensual para usuario: {}", usuarioId);

        LocalDate hoy = LocalDate.now();
        List<DatoProgreso> progreso = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            LocalDate inicioMes = hoy.minusMonths(i).withDayOfMonth(1);
            LocalDate finMes = inicioMes.plusMonths(1).minusDays(1);

            if (finMes.isAfter(hoy)) {
                finMes = hoy;
            }

            List<RegistroHabito> registrosMes = registroHabitoRepository
                    .findByUsuarioIdAndFechaBetween(usuarioId, inicioMes, finMes);

            long diasConRegistros = registrosMes.stream()
                    .filter(RegistroHabito::getCompletado)
                    .map(r -> r.getFecha())
                    .distinct()
                    .count();

            long diasEnMes = ChronoUnit.DAYS.between(inicioMes, finMes) + 1;
            double porcentaje = diasEnMes > 0 ? (double) diasConRegistros / diasEnMes * 100 : 0;

            progreso.add(new DatoProgreso(inicioMes, diasConRegistros, diasEnMes, porcentaje));
        }

        return progreso;
    }

    public List<DatoCategoria> obtenerPorCategorias(Long usuarioId) {
        log.info("Obteniendo estadísticas por categorías para usuario: {}", usuarioId);

        List<Habito> habitos = habitoRepository.findByUsuarioIdAndActivoTrue(usuarioId);
        LocalDate hoy = LocalDate.now();
        List<RegistroHabito> registrosHoy = registroHabitoRepository.findByUsuarioIdAndFecha(usuarioId, hoy);

        Map<String, List<Habito>> habitosPorCategoria = habitos.stream()
                .collect(Collectors.groupingBy(Habito::getCategoria));

        List<DatoCategoria> datosCategorias = new ArrayList<>();

        for (Map.Entry<String, List<Habito>> entry : habitosPorCategoria.entrySet()) {
            String categoria = entry.getKey();
            List<Habito> habitosCategoria = entry.getValue();
            long total = habitosCategoria.size();

            long completados = habitosCategoria.stream()
                    .filter(habito -> registrosHoy.stream()
                            .anyMatch(registro -> registro.getHabito().getId().equals(habito.getId())
                                    && registro.getCompletado()))
                    .count();

            double porcentaje = total > 0 ? (double) completados / total * 100 : 0;

            datosCategorias.add(new DatoCategoria(categoria, total, completados, porcentaje));
        }

        return datosCategorias;
    }

    private long calcularRachaActual(Long usuarioId) {
        LocalDate fecha = LocalDate.now();
        long racha = 0;

        while (true) {
            List<RegistroHabito> registrosDia = registroHabitoRepository.findByUsuarioIdAndFecha(usuarioId, fecha);
            boolean tieneCompletados = registrosDia.stream().anyMatch(RegistroHabito::getCompletado);

            if (tieneCompletados) {
                racha++;
                fecha = fecha.minusDays(1);
            } else {
                break;
            }

            // Evitar bucle infinito
            if (racha > 365) break;
        }

        return racha;
    }

    private String obtenerMejorCategoria(Long usuarioId) {
        List<DatoCategoria> categorias = obtenerPorCategorias(usuarioId);

        return categorias.stream()
                .filter(c -> c.getTotal() > 0)
                .max((c1, c2) -> Double.compare(c1.getPorcentaje(), c2.getPorcentaje()))
                .map(DatoCategoria::getCategoria)
                .orElse("Ninguna");
    }

    private long calcularDiasActivosEsteMes(Long usuarioId, LocalDate inicioMes, LocalDate finMes) {
        List<RegistroHabito> registrosMes = registroHabitoRepository
                .findByUsuarioIdAndFechaBetween(usuarioId, inicioMes, finMes);

        return registrosMes.stream()
                .filter(RegistroHabito::getCompletado)
                .map(RegistroHabito::getFecha)
                .distinct()
                .count();
    }
}
