"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, Check, AlertCircle, Target, Trophy, Heart, MessageCircle } from "lucide-react"
import { notificacionAPI, type Notificacion } from "@/lib/api"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface NotificacionesPanelProps {
  usuarioId: number
  mostrarSoloNoLeidas?: boolean
  className?: string
}

export function NotificacionesPanel({ usuarioId, mostrarSoloNoLeidas = false, className }: NotificacionesPanelProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mover cargarNotificaciones arriba del useEffect
  const cargarNotificaciones = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = mostrarSoloNoLeidas
        ? await notificacionAPI.obtenerNoLeidas(usuarioId)
        : await notificacionAPI.obtenerPorUsuario(usuarioId)

      setNotificaciones(data)
    } catch (err) {
      setError("Error al cargar notificaciones")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarNotificaciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId, mostrarSoloNoLeidas])

  const marcarComoLeida = async (notificacionId: number) => {
    try {
      await notificacionAPI.marcarComoLeida(notificacionId, "WEB")

      // Actualizar estado local
      setNotificaciones((prev) =>
        prev.map((notif) =>
          notif.id === notificacionId
            ? { ...notif, leidaEn: new Date().toISOString(), leidaEnWeb: new Date().toISOString() }
            : notif,
        ),
      )
    } catch (err) {
      console.error("Error al marcar como leída:", err)
    }
  }

  const obtenerIcono = (tipo: string) => {
    switch (tipo) {
      case "RECORDATORIO_HABITO":
        return <Target className="h-4 w-4" />
      case "LOGRO_ALCANZADO":
        return <Trophy className="h-4 w-4" />
      case "MOTIVACION_DIARIA":
        return <Heart className="h-4 w-4" />
      case "RESUMEN_SEMANAL":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const obtenerColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA":
        return "bg-red-100 text-red-800 border-red-200"
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "BAJA":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const obtenerTipoTexto = (tipo: string) => {
    switch (tipo) {
      case "RECORDATORIO_HABITO":
        return "Recordatorio"
      case "LOGRO_ALCANZADO":
        return "Logro"
      case "MOTIVACION_DIARIA":
        return "Motivación"
      case "RESUMEN_SEMANAL":
        return "Resumen"
      default:
        return "Notificación"
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          {mostrarSoloNoLeidas ? "Notificaciones Nuevas" : "Todas las Notificaciones"}
          {notificaciones.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {notificaciones.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {mostrarSoloNoLeidas ? "Notificaciones que aún no has visto" : "Historial completo de notificaciones"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notificaciones.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {mostrarSoloNoLeidas ? "No tienes notificaciones nuevas" : "No hay notificaciones"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-4 border rounded-lg transition-all ${
                    !notificacion.leidaEnWeb ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${!notificacion.leidaEnWeb ? "bg-blue-100" : "bg-gray-100"}`}>
                        {obtenerIcono(notificacion.tipo)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{notificacion.titulo}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${obtenerColorPrioridad(notificacion.prioridad)}`}
                          >
                            {obtenerTipoTexto(notificacion.tipo)}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{notificacion.mensaje}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notificacion.fechaCreacion &&
                              format(new Date(notificacion.fechaCreacion), "d MMM, HH:mm", { locale: es })}
                          </span>

                          {notificacion.habito && (
                            <Badge variant="outline" className="text-xs">
                              {notificacion.habito.nombre}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!notificacion.leidaEnWeb && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => marcarComoLeida(notificacion.id!)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      {notificacion.leidaEnWeb && (
                        <div className="text-green-600">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicadores de lectura en otras plataformas */}
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>Web:</span>
                      {notificacion.leidaEnWeb ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <span>Alexa:</span>
                      {notificacion.leidaEnAlexa ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <span>Móvil:</span>
                      {notificacion.leidaEnMovil ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {!mostrarSoloNoLeidas && notificaciones.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={cargarNotificaciones} className="w-full bg-transparent">
              Actualizar notificaciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}