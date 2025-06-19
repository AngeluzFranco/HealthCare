package mx.edu.utez.healthcare.model;



import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "habit_records")
@Data
@NoArgsConstructor
public class HabitRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HabitType habitType;

    @Column(nullable = false)
    private Double value;

    private String unit; // ml, minutos, horas

    private String exerciseType; // Opcional para ejercicio

    @Column(nullable = false)
    private LocalDate recordDate;

    private LocalDateTime createdAt = LocalDateTime.now();
}