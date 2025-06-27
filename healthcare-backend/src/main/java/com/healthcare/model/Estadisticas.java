package com.healthcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estadisticas {
    private Long totalHabitos;
    private Long habitosActivos;
    private Long habitosCompletadosHoy;
    private Double porcentajeCompletadoHoy;
    private Long rachaActual;
    private String mejorCategoria;
    private Long diasActivosEsteMes;
}
