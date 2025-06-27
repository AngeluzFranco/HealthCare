package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatoProgreso {
    private LocalDate fecha;
    private Long completados;
    private Long total;
    private Double porcentaje;
}
