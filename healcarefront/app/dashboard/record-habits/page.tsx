"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useHealthcare } from "@/hooks/useHealthcare"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, ArrowLeft, Save, Calendar, Heart, LogOut } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Usuario } from "@/lib/api"

export default function RecordHabitsPage() {
  const router = useRouter()
  const { habitos, registros, crearRegistro, loading } = useHealthcare()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split("T")[0])
  const [registrosFormData, setRegistrosFormData] = useState<
    Record<
      number,
      {
        valor: number
        notas: string
        completado: boolean
      }
    >
  >({})

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/login")
      return
    }
    setCurrentUser(JSON.parse(user))
  }, [router])

  useEffect(() => {
    // Inicializar form data con registros existentes
    const initialData: Record<number, { valor: number; notas: string; completado: boolean }> = {}
    habitos.forEach((habito) => {
      const registroExistente = registros.find((r) => r.habito.id === habito.id)
      initialData[habito.id!] = {
        valor: registroExistente?.valor || 0,
        notas: registroExistente?.notas || "",
        completado: registroExistente?.completado || false,
      }
    })
    setRegistrosFormData(initialData)
  }, [habitos, registros])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleRegistroChange = (habitoId: number, field: string, value: number | string | boolean) => {
    setRegistrosFormData((prev) => ({
      ...prev,
      [habitoId]: {
        ...prev[habitoId],
        [field]: value,
      },
    }))
  }

  const handleSubmitHabito = async (habitoId: number) => {
    const registroData = registrosFormData[habitoId]
    if (!registroData) return

    try {
      await crearRegistro(
        {
          fecha: fechaSeleccionada,
          valor: registroData.valor,
          notas: registroData.notas,
          completado: registroData.completado,
        },
        habitoId,
      )
      alert("Registro guardado correctamente")
    } catch (error) {
      alert("Error al guardar el registro")
      console.error(error)
    }
  }

  const handleSubmitTodos = async () => {
    try {
      const promesas = habitos.map((habito) => {
        const registroData = registrosFormData[habito.id!]
        if (registroData && (registroData.valor > 0 || registroData.notas || registroData.completado)) {
          return crearRegistro(
            {
              fecha: fechaSeleccionada,
              valor: registroData.valor,
              notas: registroData.notas,
              completado: registroData.completado,
            },
            habito.id!,
          )
        }
        return Promise.resolve()
      })

      await Promise.all(promesas)
      alert("Todos los registros guardados correctamente")
    } catch (error) {
      alert("Error al guardar algunos registros")
      console.error(error)
    }
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

  if (habitos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Dashboard
                  </Button>
                </Link>
                <Heart className="h-6 w-6 text-blue-600 mx-4" />
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No tienes hábitos configurados</h2>
            <p className="text-gray-600 mb-6">
              Primero necesitas crear algunos hábitos para poder registrar tu progreso
            </p>
            <Link href="/dashboard/habits">
              <Button size="lg">Crear Hábitos</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Dashboard
                </Button>
              </Link>
              <Heart className="h-6 w-6 text-blue-600 mx-4" />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Registrar Hábitos</h1>
                <p className="text-gray-600">Registra tu progreso diario</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  className="w-auto"
                />
              </div>
              <Button onClick={handleSubmitTodos} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Todo
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de la fecha */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Registros para {format(new Date(fechaSeleccionada), "EEEE, d MMMM yyyy", { locale: es })}
              </h2>
              <p className="text-gray-600">Completa la información de tus hábitos para este día</p>
            </div>
          </CardContent>
        </Card>

        {/* Lista de hábitos para registrar */}
        <div className="space-y-6">
          {habitos.map((habito) => {
            const registroData = registrosFormData[habito.id!] || { valor: 0, notas: "", completado: false }
            const registroExistente = registros.find((r) => r.habito.id === habito.id)

            return (
              <Card key={habito.id} className={`${registroData.completado ? "ring-2 ring-green-500" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        {habito.nombre}
                      </CardTitle>
                      <CardDescription>
                        {habito.descripcion} • Meta: {habito.metaDiaria}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`completado-${habito.id}`}
                        checked={registroData.completado}
                        onCheckedChange={(checked) =>
                          handleRegistroChange(habito.id!, "completado", checked as boolean)
                        }
                      />
                      <Label htmlFor={`completado-${habito.id}`} className="text-sm">
                        Completado
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`valor-${habito.id}`}>Valor ({habito.unidadMedida})</Label>
                      <Input
                        id={`valor-${habito.id}`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={registroData.valor || ""}
                        onChange={(e) =>
                          handleRegistroChange(habito.id!, "valor", Number.parseFloat(e.target.value) || 0)
                        }
                        placeholder={`Ej: ${habito.metaDiaria.split(" ")[0]}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`notas-${habito.id}`}>Notas (opcional)</Label>
                      <Textarea
                        id={`notas-${habito.id}`}
                        value={registroData.notas}
                        onChange={(e) => handleRegistroChange(habito.id!, "notas", e.target.value)}
                        placeholder="Agrega comentarios sobre tu progreso..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Progreso visual */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>
                        {registroData.valor} / {habito.metaDiaria.split(" ")[0]} {habito.unidadMedida}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          registroData.completado ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (registroData.valor / Number.parseFloat(habito.metaDiaria.split(" ")[0])) * 100,
                            100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Estado del registro */}
                  {registroExistente && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ✓ Ya tienes un registro para este día. Los cambios actualizarán el registro existente.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => handleSubmitHabito(habito.id!)}
                      disabled={loading}
                      variant={registroData.completado ? "default" : "outline"}
                      size="sm"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Resumen del día */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumen del Día</CardTitle>
            <CardDescription>
              Tu progreso general para {format(new Date(fechaSeleccionada), "d MMMM yyyy", { locale: es })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(registrosFormData).filter((r) => r.completado).length}
                </div>
                <p className="text-sm text-gray-600">Hábitos Completados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{habitos.length}</div>
                <p className="text-sm text-gray-600">Total de Hábitos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {habitos.length > 0
                    ? Math.round(
                        (Object.values(registrosFormData).filter((r) => r.completado).length / habitos.length) * 100,
                      )
                    : 0}
                  %
                </div>
                <p className="text-sm text-gray-600">Porcentaje Completado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comandos de Alexa */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Comandos de Voz con Alexa</CardTitle>
            <CardDescription>Usa estos comandos para registrar tus hábitos por voz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Registro Rápido:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Alexa, registra que bebí 8 vasos de agua"</li>
                  <li>• "Alexa, completé 30 minutos de ejercicio"</li>
                  <li>• "Alexa, caminé 10000 pasos hoy"</li>
                  <li>• "Alexa, marqué como completado beber agua"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Consultas:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Alexa, ¿cómo va mi progreso hoy?"</li>
                  <li>• "Alexa, ¿qué hábitos me faltan?"</li>
                  <li>• "Alexa, muestra mi resumen semanal"</li>
                  <li>• "Alexa, ¿cuál es mi racha actual?"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
