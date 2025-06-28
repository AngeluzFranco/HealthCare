// Configuración de la API
const API_BASE_URL = "http://localhost:8080/api"

// Función helper para manejar errores de fetch
const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    console.log(`🔄 Haciendo petición a: ${url}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    console.log(`📡 Respuesta recibida: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error("❌ Error en fetch:", error)

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080",
      )
    }

    throw error
  }
}

// Tipos para el backend
export interface Usuario {
  id?: number
  email: string
  nombre: string
  apellido: string
  edad: number
  genero: string
  pesoKg: number
  alturaCm: number
  nivelActividad: string
  objetivoSalud: string
  password?: string 
  fechaCreacion?: string
  fechaActualizacion?: string
}

export interface Habito {
  id?: number
  usuario: { id: number }
  nombre: string
  descripcion: string
  categoria: string
  metaDiaria: string
  unidadMedida: string
  activo: boolean
  fechaCreacion?: string
}

export interface RegistroHabito {
  id?: number
  habito: Habito
  fecha: string
  valor: number
  notas: string
  completado: boolean
  fechaRegistro?: string
}

// Interfaces para estadísticas
export interface EstadisticasUsuario {
  totalHabitos: number
  habitosActivos: number
  habitosCompletadosHoy: number
  porcentajeCompletadoHoy: number
  rachaActual: number
  mejorCategoria: string
  diasActivosEsteMes: number
}

export interface DatoProgreso {
  fecha: string
  completados: number
  total: number
  porcentaje: number
}

export interface DatoCategoria {
  categoria: string
  total: number
  completados: number
  porcentaje: number
}

// Interfaces para notificaciones
export interface Notificacion {
  id?: number
  usuario: { id: number }
  habito?: Habito
  tipo: string
  titulo: string
  mensaje: string
  mensajeAlexa?: string
  estado: string
  prioridad: string
  canalesEntrega: string
  programadaPara?: string
  enviadaEn?: string
  leidaEn?: string
  leidaEnAlexa?: string
  leidaEnMovil?: string
  leidaEnWeb?: string
  esRecurrente: boolean
  patronRecurrencia?: string
  fechaCreacion?: string
}

export interface ConfiguracionNotificacion {
  id?: number
  usuario: { id: number }
  notificacionesHabilitadas: boolean
  pushHabilitado: boolean
  alexaHabilitado: boolean
  emailHabilitado: boolean
  smsHabilitado: boolean
  horarioMatutino: string
  horarioVespertino: string
  horarioNocturno: string
  recordatoriosHabitos: boolean
  notificacionesLogros: boolean
  motivacionDiaria: boolean
  resumenSemanal: boolean
  incluirFinesSemana: boolean
  alexaDeviceId?: string
  alexaUserId?: string
  fcmToken?: string
  apnsToken?: string
}

// Funciones para usuarios
export const usuarioAPI = {
  obtenerTodos: async (): Promise<Usuario[]> => {
    const response = await handleFetch(`${API_BASE_URL}/usuarios`)
    return response.json()
  },

  obtenerPorId: async (id: number): Promise<Usuario> => {
    const response = await handleFetch(`${API_BASE_URL}/usuarios/${id}`)
    return response.json()
  },

  crear: async (usuario: Usuario): Promise<Usuario> => {
    const response = await handleFetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      body: JSON.stringify(usuario),
    })
    return response.json()
  },

  actualizar: async (id: number, usuario: Usuario): Promise<Usuario> => {
    const response = await handleFetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    })
    return response.json()
  },

  eliminar: async (id: number): Promise<void> => {
    await handleFetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    })
  },
}

// Funciones para hábitos
export const habitoAPI = {
  obtenerPorUsuario: async (usuarioId: number): Promise<Habito[]> => {
    const response = await handleFetch(`${API_BASE_URL}/habitos/usuario/${usuarioId}`)
    return response.json()
  },

  obtenerPorId: async (id: number): Promise<Habito> => {
    const response = await handleFetch(`${API_BASE_URL}/habitos/${id}`)
    return response.json()
  },

  crear: async (habito: Habito): Promise<Habito> => {
    const response = await handleFetch(`${API_BASE_URL}/habitos`, {
      method: "POST",
      body: JSON.stringify(habito),
    })
    return response.json()
  },

  actualizar: async (id: number, habito: Partial<Habito>): Promise<Habito> => {
    const response = await handleFetch(`${API_BASE_URL}/habitos/${id}`, {
      method: "PUT",
      body: JSON.stringify(habito),
    })
    return response.json()
  },

  eliminar: async (id: number): Promise<void> => {
    await handleFetch(`${API_BASE_URL}/habitos/${id}`, {
      method: "DELETE",
    })
  },
}

// Funciones para registros
export const registroAPI = {
  obtenerPorUsuarioYFecha: async (usuarioId: number, fecha: string): Promise<RegistroHabito[]> => {
    const response = await handleFetch(`${API_BASE_URL}/registros/usuario/${usuarioId}/fecha/${fecha}`)
    return response.json()
  },

  obtenerPorRango: async (usuarioId: number, fechaInicio: string, fechaFin: string): Promise<RegistroHabito[]> => {
    const response = await handleFetch(
      `${API_BASE_URL}/registros/usuario/${usuarioId}/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    )
    return response.json()
  },

  obtenerPorHabito: async (habitoId: number): Promise<RegistroHabito[]> => {
    const response = await handleFetch(`${API_BASE_URL}/registros/habito/${habitoId}`)
    return response.json()
  },

  crear: async (registro: RegistroHabito): Promise<RegistroHabito> => {
    const response = await handleFetch(`${API_BASE_URL}/registros`, {
      method: "POST",
      body: JSON.stringify(registro),
    })
    return response.json()
  },

  actualizar: async (id: number, registro: Partial<RegistroHabito>): Promise<RegistroHabito> => {
    const response = await handleFetch(`${API_BASE_URL}/registros/${id}`, {
      method: "PUT",
      body: JSON.stringify(registro),
    })
    return response.json()
  },

  eliminar: async (id: number): Promise<void> => {
    await handleFetch(`${API_BASE_URL}/registros/${id}`, {
      method: "DELETE",
    })
  },
}

// Funciones para estadísticas
export const estadisticasAPI = {
  obtenerEstadisticasUsuario: async (usuarioId: number): Promise<EstadisticasUsuario> => {
    const response = await handleFetch(`${API_BASE_URL}/estadisticas/usuario/${usuarioId}`)
    return response.json()
  },

  obtenerProgresoSemanal: async (usuarioId: number): Promise<DatoProgreso[]> => {
    const response = await handleFetch(`${API_BASE_URL}/estadisticas/usuario/${usuarioId}/progreso-semanal`)
    return response.json()
  },

  obtenerProgresoMensual: async (usuarioId: number): Promise<DatoProgreso[]> => {
    const response = await handleFetch(`${API_BASE_URL}/estadisticas/usuario/${usuarioId}/progreso-mensual`)
    return response.json()
  },

  obtenerPorCategorias: async (usuarioId: number): Promise<DatoCategoria[]> => {
    const response = await handleFetch(`${API_BASE_URL}/estadisticas/usuario/${usuarioId}/por-categorias`)
    return response.json()
  },
}

// Función para verificar la conexión con el backend
export const verificarConexion = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.ok
  } catch (error) {
    console.error("❌ No se puede conectar al backend:", error)
    return false
  }
}


export const notificacionAPI = {
  obtenerPorUsuario: async (usuarioId: number): Promise<Notificacion[]> => {
    const response = await handleFetch(`${API_BASE_URL}/notificaciones/usuario/${usuarioId}`)
    return response.json()
  },
  obtenerNoLeidas: async (usuarioId: number): Promise<Notificacion[]> => {
    const response = await handleFetch(`${API_BASE_URL}/notificaciones/usuario/${usuarioId}/no-leidas`)
    return response.json()
  },
  marcarComoLeida: async (notificacionId: number, canal: string): Promise<void> => {
    await handleFetch(`${API_BASE_URL}/notificaciones/${notificacionId}/marcar-leida`, {
      method: "POST",
      body: JSON.stringify({ canal }),
    })
  },

  obtenerConfiguracionNotificacion: async (usuarioId: number): Promise<ConfiguracionNotificacion> => {
    const response = await handleFetch(`${API_BASE_URL}/notificaciones/configuracion/usuario/${usuarioId}`)
    return response.json()
  },
}
