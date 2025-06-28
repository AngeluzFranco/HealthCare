package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "configuraciones_notificacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ConfiguracionNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    // Configuraciones generales
    @Column(name = "notificaciones_habilitadas")
    private Boolean notificacionesHabilitadas = true;

    @Column(name = "push_habilitado")
    private Boolean pushHabilitado = true;

    @Column(name = "alexa_habilitado")
    private Boolean alexaHabilitado = true;

    @Column(name = "email_habilitado")
    private Boolean emailHabilitado = false;

    @Column(name = "sms_habilitado")
    private Boolean smsHabilitado = false;

    // Horarios preferidos
    @Column(name = "horario_matutino")
    private LocalTime horarioMatutino = LocalTime.of(8, 0);

    @Column(name = "horario_vespertino")
    private LocalTime horarioVespertino = LocalTime.of(14, 0);

    @Column(name = "horario_nocturno")
    private LocalTime horarioNocturno = LocalTime.of(20, 0);

    // Configuraciones específicas
    @Column(name = "recordatorios_habitos")
    private Boolean recordatoriosHabitos = true;

    @Column(name = "notificaciones_logros")
    private Boolean notificacionesLogros = true;

    @Column(name = "motivacion_diaria")
    private Boolean motivacionDiaria = true;

    @Column(name = "resumen_semanal")
    private Boolean resumenSemanal = true;

    @Column(name = "incluir_fines_semana")
    private Boolean incluirFinesSemana = false;

    // Configuración de Alexa
    @Column(name = "alexa_device_id")
    private String alexaDeviceId;

    @Column(name = "alexa_user_id")
    private String alexaUserId;

    // Tokens para notificaciones push
    @Column(name = "fcm_token")
    private String fcmToken; // Firebase Cloud Messaging

    @Column(name = "apns_token")
    private String apnsToken; // Apple Push Notification Service

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}
