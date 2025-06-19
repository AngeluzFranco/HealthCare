package mx.edu.utez.healthcare.model;



import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
public class Goal {
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
    private Double targetValue;

    @Enumerated(EnumType.STRING)
    private Frequency frequency = Frequency.DAILY;

    public enum Frequency {
        DAILY
    }
}