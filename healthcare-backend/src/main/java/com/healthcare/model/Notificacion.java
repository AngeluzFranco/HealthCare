package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "habito_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Habito habito; // Opcional

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TipoNotificacion tipo;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 500)
    private String mensaje;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoNotificacion estado;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PrioridadNotificacion prioridad;

    @Column(name = "enviada_en")
    private LocalDateTime enviadaEn;

    @Column(name = "leida_en")
    private LocalDateTime leidaEn;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    // Enums
    public enum TipoNotificacion {
        RECORDATORIO_HABITO,
        LOGRO_ALCANZADO,
        MOTIVACION_DIARIA
    }

    public enum EstadoNotificacion {
        PROGRAMADA,
        ENVIADA,
        LEIDA
    }

    public enum PrioridadNotificacion {
        BAJA,
        MEDIA,
        ALTA
    }
}