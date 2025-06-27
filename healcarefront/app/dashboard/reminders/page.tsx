"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Heart, LogOut, Bell, Clock, Smartphone, Mail, Mic } from "lucide-react"
import Link from "next/link"
import type { Usuario } from "@/lib/api"

export default function RemindersPage() {
  const router = useRouter()
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Dashboard
                </Button>
              </Link>
              <Heart className="h-6 w-6 text-blue-600 mx-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recordatorios</h1>
                <p className="text-gray-600">Configura notificaciones para tus hábitos</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuración general */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>Ajusta las preferencias globales de notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notificaciones habilitadas</Label>
                  <p className="text-sm text-gray-600">Recibir recordatorios de hábitos</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound">Sonido de notificación</Label>
                  <p className="text-sm text-gray-600">Reproducir sonido con las notificaciones</p>
                </div>
                <Switch id="sound" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="vibration">Vibración</Label>
                  <p className="text-sm text-gray-600">Vibrar en dispositivos móviles</p>
                </div>
                <Switch id="vibration" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia de recordatorios</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Horarios Preferidos
              </CardTitle>
              <CardDescription>Define cuándo quieres recibir recordatorios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="morning">Recordatorio matutino</Label>
                <Input type="time" id="morning" defaultValue="08:00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="afternoon">Recordatorio vespertino</Label>
                <Input type="time" id="afternoon" defaultValue="14:00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening">Recordatorio nocturno</Label>
                <Input type="time" id="evening" defaultValue="20:00" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekend">Recordatorios en fin de semana</Label>
                  <p className="text-sm text-gray-600">Incluir sábados y domingos</p>
                </div>
                <Switch id="weekend" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canales de notificación */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Canales de Notificación</CardTitle>
            <CardDescription>Elige cómo quieres recibir tus recordatorios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                  <Switch defaultChecked />
                </div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-600">Notificaciones en tu dispositivo</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Mail className="h-6 w-6 text-green-600" />
                  <Switch />
                </div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-600">Recordatorios por correo electrónico</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Mic className="h-6 w-6 text-purple-600" />
                  <Switch defaultChecked />
                </div>
                <h3 className="font-medium">Alexa</h3>
                <p className="text-sm text-gray-600">Recordatorios por voz con Alexa</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Bell className="h-6 w-6 text-orange-600" />
                  <Switch />
                </div>
                <h3 className="font-medium">SMS</h3>
                <p className="text-sm text-gray-600">Mensajes de texto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recordatorios por hábito */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recordatorios por Hábito</CardTitle>
            <CardDescription>Configura recordatorios específicos para cada hábito</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Ejemplo de hábitos */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Beber agua</h3>
                    <p className="text-sm text-gray-600">Meta: 8 vasos al día</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="every-2h">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="every-1h">Cada hora</SelectItem>
                        <SelectItem value="every-2h">Cada 2 horas</SelectItem>
                        <SelectItem value="every-4h">Cada 4 horas</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Ejercicio</h3>
                    <p className="text-sm text-gray-600">Meta: 30 minutos al día</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="every-2d">Cada 2 días</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Meditación</h3>
                    <p className="text-sm text-gray-600">Meta: 15 minutos al día</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="every-2d">Cada 2 días</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Alexa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="mr-2 h-5 w-5 text-purple-600" />
              Configuración de Alexa
            </CardTitle>
            <CardDescription>Personaliza los recordatorios por voz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="alexa-enabled">Recordatorios de Alexa</Label>
                    <p className="text-sm text-gray-600">Habilitar recordatorios por voz</p>
                  </div>
                  <Switch id="alexa-enabled" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alexa-voice">Tipo de voz</Label>
                  <Select defaultValue="female">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de voz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Voz femenina</SelectItem>
                      <SelectItem value="male">Voz masculina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alexa-language">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Frases de ejemplo</Label>
                  <div className="mt-2 space-y-2">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">"Es hora de beber agua. Has bebido 3 de 8 vasos hoy."</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        "Recordatorio: Es momento de hacer ejercicio. ¡Vamos por esos 30 minutos!"
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        "¡Felicidades! Has completado 5 de 7 hábitos hoy. Solo te faltan 2 más."
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Mic className="mr-2 h-4 w-4" />
                  Probar recordatorio de voz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline">Cancelar</Button>
          <Button>Guardar Configuración</Button>
        </div>
      </div>
    </div>
  )
}
