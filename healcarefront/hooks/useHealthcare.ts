"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  usuarioAPI,
  habitoAPI,
  registroAPI,
  estadisticasAPI,
  verificarConexion,
  type Usuario,
  type Habito,
  type RegistroHabito,
  type EstadisticasUsuario,
  type DatoProgreso,
  type DatoCategoria,
} from "@/lib/api"

export function useHealthcare() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [habitos, setHabitos] = useState<Habito[]>([])
  const [registros, setRegistros] = useState<RegistroHabito[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuario | null>(null)
  const [progresoSemanal, setProgresoSemanal] = useState<DatoProgreso[]>([])
  const [progresoMensual, setProgresoMensual] = useState<DatoProgreso[]>([])
  const [datosCategorias, setDatosCategorias] = useState<DatoCategoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)

  const loadingRef = useRef(false)

  // Verificar conexión con el backend
  const verificarBackend = useCallback(async () => {
    if (loadingRef.current) return backendConnected

    console.log("🔍 Verificando conexión con el backend...")
    const connected = await verificarConexion()
    setBackendConnected(connected)

    if (!connected) {
      setError("No se puede conectar al backend. Asegúrate de que esté corriendo en http://localhost:8080")
    } else {
      console.log("✅ Backend conectado correctamente")
    }

    return connected
  }, [backendConnected])

  // Cargar datos iniciales
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser && !usuario) {
      const user = JSON.parse(currentUser)
      setUsuario(user)
      cargarDatosUsuario(user.id)
    }
  }, [usuario])

  const cargarDatosUsuario = useCallback(async (usuarioId: number) => {
    if (loadingRef.current) return

    try {
      loadingRef.current = true
      setLoading(true)
      setError(null)

      console.log("📊 Cargando datos del usuario:", usuarioId)

      // Load habits first
      const habitosUsuario = await habitoAPI.obtenerPorUsuario(usuarioId)
      console.log("🎯 Hábitos cargados:", habitosUsuario?.length || 0)
      setHabitos(habitosUsuario || [])

      // Load today's records
      const hoy = new Date().toISOString().split("T")[0]
      const registrosHoy = await registroAPI.obtenerPorUsuarioYFecha(usuarioId, hoy)
      console.log("📝 Registros de hoy:", registrosHoy?.length || 0)
      setRegistros(registrosHoy || [])

      // Load statistics
      try {
        const estadisticasUsuario = await estadisticasAPI.obtenerEstadisticasUsuario(usuarioId)
        setEstadisticas(estadisticasUsuario)
        console.log("📈 Estadísticas cargadas:", estadisticasUsuario)
      } catch (err) {
        console.warn("⚠️ No se pudieron cargar las estadísticas:", err)
      }

      // Load weekly progress
      try {
        const progreso = await estadisticasAPI.obtenerProgresoSemanal(usuarioId)
        setProgresoSemanal(progreso)
      } catch (err) {
        console.warn("⚠️ No se pudo cargar el progreso semanal:", err)
      }

      // Load data by categories
      try {
        const categorias = await estadisticasAPI.obtenerPorCategorias(usuarioId)
        setDatosCategorias(categorias)
      } catch (err) {
        console.warn("⚠️ No se pudieron cargar los datos por categorías:", err)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      console.error("❌ Error cargando datos:", err)

      // Set empty arrays on error to prevent undefined issues
      setHabitos([])
      setRegistros([])
      setEstadisticas(null)
      setProgresoSemanal([])
      setDatosCategorias([])
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [])

  const crearUsuario = async (nuevoUsuario: Usuario) => {
    try {
      setLoading(true)
      setError(null)

      const connected = await verificarBackend()
      if (!connected) {
        throw new Error("No hay conexión con el backend")
      }

      console.log("👤 Creando nuevo usuario:", nuevoUsuario.email)
      const usuarioCreado = await usuarioAPI.crear(nuevoUsuario)
      setUsuario(usuarioCreado)
      console.log("✅ Usuario creado exitosamente")
      return usuarioCreado
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear usuario"
      setError(errorMessage)
      console.error("❌ Error creando usuario:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const crearHabito = async (nuevoHabito: Omit<Habito, "usuario">) => {
    if (!usuario) throw new Error("No hay usuario seleccionado")

    try {
      setLoading(true)
      setError(null)

      console.log("🎯 Creando nuevo hábito:", nuevoHabito.nombre)
      const habitoCompleto = { ...nuevoHabito, usuario: { id: usuario.id! } }
      const habitoCreado = await habitoAPI.crear(habitoCompleto)
      setHabitos((prev) => [...prev, habitoCreado])

      // Recargar estadísticas después de crear un hábito
      if (usuario.id) {
        cargarEstadisticas(usuario.id)
      }

      console.log("✅ Hábito creado exitosamente")
      return habitoCreado
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear hábito"
      setError(errorMessage)
      console.error("❌ Error creando hábito:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const crearRegistro = async (nuevoRegistro: Omit<RegistroHabito, "habito">, habitoId: number) => {
    try {
      setLoading(true)
      setError(null)

      console.log("📝 Creando nuevo registro para hábito:", habitoId)

      // Find the complete habit
      const habito = habitos.find((h) => h.id === habitoId)
      if (!habito) {
        throw new Error("Hábito no encontrado")
      }

      const registroCompleto = { ...nuevoRegistro, habito }
      const registroCreado = await registroAPI.crear(registroCompleto)

      // Update local registros
      setRegistros((prev) => {
        const existingIndex = prev.findIndex((r) => r.habito.id === habitoId && r.fecha === nuevoRegistro.fecha)

        if (existingIndex >= 0) {
          // Update existing registro
          const newRegistros = [...prev]
          newRegistros[existingIndex] = registroCreado
          return newRegistros
        } else {
          // Add new registro
          return [...prev, registroCreado]
        }
      })

      // Recargar estadísticas después de crear un registro
      if (usuario?.id) {
        cargarEstadisticas(usuario.id)
      }

      console.log("✅ Registro creado exitosamente")
      return registroCreado
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear registro"
      setError(errorMessage)
      console.error("❌ Error creando registro:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const actualizarUsuario = async (datosActualizados: Partial<Usuario>) => {
    if (!usuario) throw new Error("No hay usuario seleccionado")

    try {
      setLoading(true)
      setError(null)

      console.log("👤 Actualizando usuario:", usuario.id)
      const usuarioActualizado = await usuarioAPI.actualizar(usuario.id!, { ...usuario, ...datosActualizados })
      setUsuario(usuarioActualizado)

      localStorage.setItem("currentUser", JSON.stringify(usuarioActualizado))

      console.log("✅ Usuario actualizado exitosamente")
      return usuarioActualizado
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar usuario"
      setError(errorMessage)
      console.error("❌ Error actualizando usuario:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cargarEstadisticas = async (usuarioId: number) => {
    try {
      const [estadisticasData, progresoSemanalData, categorias] = await Promise.all([
        estadisticasAPI.obtenerEstadisticasUsuario(usuarioId),
        estadisticasAPI.obtenerProgresoSemanal(usuarioId),
        estadisticasAPI.obtenerPorCategorias(usuarioId),
      ])

      setEstadisticas(estadisticasData)
      setProgresoSemanal(progresoSemanalData)
      setDatosCategorias(categorias)
    } catch (err) {
      console.warn("⚠️ Error cargando estadísticas:", err)
    }
  }

  const cargarRegistrosPorRango = async (fechaInicio: string, fechaFin: string) => {
    if (!usuario) return []

    try {
      setLoading(true)
      setError(null)

      console.log("📊 Cargando registros por rango:", fechaInicio, "a", fechaFin)
      const registrosRango = await registroAPI.obtenerPorRango(usuario.id!, fechaInicio, fechaFin)
      console.log("✅ Registros cargados:", registrosRango.length)
      return registrosRango
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar registros"
      setError(errorMessage)
      console.error("❌ Error cargando registros:", err)
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    usuario,
    habitos,
    registros,
    estadisticas,
    progresoSemanal,
    progresoMensual,
    datosCategorias,
    loading,
    error,
    backendConnected,
    cargarDatosUsuario,
    crearUsuario,
    crearHabito,
    crearRegistro,
    actualizarUsuario,
    cargarRegistrosPorRango,
    cargarEstadisticas,
    verificarBackend,
  }
}
