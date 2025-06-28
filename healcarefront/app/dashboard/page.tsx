"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useHealthcare } from "@/hooks/useHealthcare"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Heart,
  Target,
  BarChart3,
  Bell,
  FileText,
  Settings,
  LogOut,
  Mic,
  Smartphone,
  Droplets,
  Dumbbell,
  Moon,
  AlertCircle,
  Plus,
} from "lucide-react"
import Link from "next/link"
import type { Usuario } from "@/lib/api"
import { NotificacionesPanel } from "@/components/notificaciones-panel"

export default function DashboardPage() {
  const router = useRouter()
  const { habitos, registros, loading, error, backendConnected } = useHealthcare()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/login")
      return
    }
    setCurrentUser(JSON.parse(user))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleQuickRegister = (type: string) => {
    router.push("/dashboard/record-habits")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error && !habitos.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (backendConnected === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No se puede conectar al servidor backend
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calcular progreso de hábitos principales con datos por defecto
  const habitoAgua = habitos.find((h) => h.categoria === "hidratacion") || {
    metaDiaria: "2000 ml",
    unidadMedida: "ml",
    id: undefined,
  }
  const habitoEjercicio = habitos.find((h) => h.categoria === "ejercicio") || {
    metaDiaria: "30 min",
    unidadMedida: "min",
    id: undefined,
  }
  const habitoSueno = habitos.find((h) => h.categoria === "sueno") || {
    metaDiaria: "8 hrs",
    unidadMedida: "hrs",
    id: undefined,
  }

  const registroAgua = registros.find((r) => r.habito.id === habitoAgua?.id)
  const registroEjercicio = registros.find((r) => r.habito.id === habitoEjercicio?.id)
  const registroSueno = registros.find((r) => r.habito.id === habitoSueno?.id)

  const calcularPorcentaje = (valor: number, meta: string) => {
    const metaNum = Number.parseFloat(meta.split(" ")[0])
    return metaNum > 0 ? Math.round((valor / metaNum) * 100) : 0
  }

  // Sugerencias Personalizadas Dinámicas
  const sugerencias: string[] = [];

  if (habitos.length === 0) {
    sugerencias.push("¡Comienza creando tu primer hábito! Ve a 'Gestionar Metas' para empezar.");
  } else {
    // Agua
    const porcentajeAgua = calcularPorcentaje(registroAgua?.valor || 0, habitoAgua?.metaDiaria || "2000 ml");
    if (!registroAgua || registroAgua.valor === 0) {
      sugerencias.push("No has registrado tu consumo de agua hoy. ¡Recuerda hidratarte!");
    } else if (porcentajeAgua < 100) {
      sugerencias.push("Recuerda que aún no has completado tu meta diaria de agua.");
    } else {
      sugerencias.push("¡Felicidades! Has alcanzado tu meta de hidratación hoy.");
    }

    // Ejercicio
    const porcentajeEjercicio = calcularPorcentaje(registroEjercicio?.valor || 0, habitoEjercicio?.metaDiaria || "30 min");
    if (!registroEjercicio || registroEjercicio.valor === 0) {
      sugerencias.push("No has registrado ejercicio hoy. ¡Un poco de movimiento hace la diferencia!");
    } else if (porcentajeEjercicio < 100) {
      sugerencias.push("Recuerda que aún no has completado tu meta diaria de ejercicio.");
    } else {
      sugerencias.push("¡Excelente! Has cumplido tu meta de ejercicio hoy.");
    }

    // Sueño
    const porcentajeSueno = calcularPorcentaje(registroSueno?.valor || 0, habitoSueno?.metaDiaria || "8 hrs");
    if (!registroSueno || registroSueno.valor === 0) {
      sugerencias.push("No has registrado tus horas de sueño. Dormir bien es clave para tu salud.");
    } else if (porcentajeSueno < 100) {
      sugerencias.push("Recuerda que aún no has completado tu meta diaria de sueño.");
    } else {
      sugerencias.push("¡Muy bien! Has cumplido tu meta de sueño hoy.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        {/* Header del sidebar */}
        <div className="p-6 border-b">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Panel de HealthCare</h1>
          </div>
        </div>

        {/* Navegación */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Acciones Rápidas</h2>
            <nav className="space-y-2">
              <Link href="/dashboard/record-habits">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <Activity className="mr-3 h-4 w-4" />
                  Registrar Hábitos
                </Button>
              </Link>
              <Link href="/dashboard/habits">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <Target className="mr-3 h-4 w-4" />
                  Gestionar Metas
                </Button>
              </Link>
              <Link href="/dashboard/statistics">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Ver Estadísticas
                </Button>
              </Link>
              {/* Cambiado: ahora muestra Notificaciones en vez de Recordatorios */}
              <Link href="/dashboard/notifications">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <Bell className="mr-3 h-4 w-4" />
                  Notificaciones
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <FileText className="mr-3 h-4 w-4" />
                  Generar Reporte
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <Settings className="mr-3 h-4 w-4" />
                  Configuración de Perfil
                </Button>
              </Link>
            </nav>
          </div>

          {/* Mini menú de notificaciones */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Notificaciones</h2>
            <NotificacionesPanel
              usuarioId={currentUser.id!}
              mostrarSoloNoLeidas={true}
              className="border-0 shadow-none bg-gray-50"
            />
          </div>

          {/* Skill de Alexa */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Mic className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Skill de Alexa</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">Usa tu voz para consultar tu progreso y recibir recordatorios.</p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>
                <strong>Comandos disponibles:</strong>
              </p>
              <p>• "Alexa, pregunta a HealthCare cómo voy hoy"</p>
              <p>• "Alexa, pregunta a HealthCare por mis recordatorios"</p>
              <p>• "Alexa, pregunta a HealthCare mi progreso de agua"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Header principal */}
        <div className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de HealthCare</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Bienvenido, {currentUser.nombre} {currentUser.apellido}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido del dashboard */}
        <div className="p-8">
          {/* Mostrar error si existe */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progreso de Hoy - Hábitos Principales */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso de Hoy - Hábitos Principales</h2>
            {habitos.length === 0 ? (
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes hábitos principales configurados.</p>
                  <Link href="/dashboard/habits">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primer Hábito
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Consumo de Agua */}
                {habitoAgua && habitoAgua.id && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600">Consumo de Agua</CardTitle>
                        <Droplets className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {registroAgua?.valor || 0} / {habitoAgua?.metaDiaria || "2000 ml"}
                      </div>
                      <p className="text-xs text-gray-500">
                        {calcularPorcentaje(registroAgua?.valor || 0, habitoAgua?.metaDiaria || "2000 ml")}% de la meta diaria
                      </p>
                    </CardContent>
                  </Card>
                )}
                {/* Tiempo de Ejercicio */}
                {habitoEjercicio && habitoEjercicio.id && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600">Tiempo de Ejercicio</CardTitle>
                        <Dumbbell className="h-5 w-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {registroEjercicio?.valor || 0} / {habitoEjercicio?.metaDiaria || "30 min"}
                      </div>
                      <p className="text-xs text-gray-500">
                        {calcularPorcentaje(registroEjercicio?.valor || 0, habitoEjercicio?.metaDiaria || "30 min")}% de la meta diaria
                      </p>
                    </CardContent>
                  </Card>
                )}
                {/* Horas de Sueño */}
                {habitoSueno && habitoSueno.id && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600">Horas de Sueño</CardTitle>
                        <Moon className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {registroSueno?.valor || 0} / {habitoSueno?.metaDiaria || "8 hrs"}
                      </div>
                      <p className="text-xs text-gray-500">
                        {calcularPorcentaje(registroSueno?.valor || 0, habitoSueno?.metaDiaria || "8 hrs")}% de la meta diaria
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sugerencias Personalizadas */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Sugerencias Personalizadas</CardTitle>
                <CardDescription>Basado en tu actividad reciente y metas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sugerencias.map((s, idx) => (
                    <div className="flex items-start" key={idx}>
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                      <p className="text-sm text-gray-700">{s}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registro Rápido */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Registro Rápido</CardTitle>
                <CardDescription>Registra rápidamente tus actividades de hoy</CardDescription>
              </CardHeader>
              <CardContent>
                {habitos.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No tienes hábitos configurados</p>
                    <Link href="/dashboard/habits">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Primer Hábito
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {habitos.map((habito) => (
                      <Button
                        key={habito.id}
                        className={
                          habito.categoria === "hidratacion"
                            ? "bg-blue-500 hover:bg-blue-600 text-white py-3"
                            : habito.categoria === "ejercicio"
                            ? "bg-green-500 hover:bg-green-600 text-white py-3"
                            : habito.categoria === "sueno"
                            ? "bg-purple-500 hover:bg-purple-600 text-white py-3"
                            : "bg-gray-500 hover:bg-gray-600 text-white py-3"
                        }
                        onClick={() => handleQuickRegister(habito.categoria)}
                      >
                        {habito.categoria === "hidratacion" && <Droplets className="mr-2 h-4 w-4" />}
                        {habito.categoria === "ejercicio" && <Dumbbell className="mr-2 h-4 w-4" />}
                        {habito.categoria === "sueno" && <Moon className="mr-2 h-4 w-4" />}
                        {habito.categoria !== "hidratacion" && habito.categoria !== "ejercicio" && habito.categoria !== "sueno" && <Target className="mr-2 h-4 w-4" />}
                        Registrar {habito.nombre}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Acceso Multiplataforma */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Acceso Multiplataforma
                </CardTitle>
                <CardDescription>Usa HealthCare desde cualquier dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* App Móvil */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">App Móvil</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Registra hábitos sobre la marcha con nuestra app móvil nativa para Android.
                      </p>
                    </div>
                  </div>

                  {/* Skill de Alexa */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Mic className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Skill de Alexa</h3>
                      <p className="text-sm text-gray-600 mb-3">Consulta tu progreso y recibe recordatorios por voz.</p>
                      <div className="text-xs text-gray-500 space-y-1 mb-3">
                        <p>• "Alexa, abre HealthCare"</p>
                        <p>• "¿Cómo voy con mis metas?"</p>
                        <p>• "Recuérdame beber agua"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}