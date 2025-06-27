package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatoCategoria {
    private String categoria;
    private Long total;
    private Long completados;
    private Double porcentaje;
}
