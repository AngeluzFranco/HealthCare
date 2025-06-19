package mx.edu.utez.healthcare.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import mx.edu.utez.healthcare.model.HabitType;

import java.time.LocalDate;

@Data
public class HabitRecordDto {
    @NotNull
    private HabitType habitType;
    @NotNull
    @Positive
    private Double value;
    private String unit;
    private String exerciseType;
    private LocalDate recordDate;
}